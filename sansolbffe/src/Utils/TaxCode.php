<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Utils;

/**
 * Classe che gestisce i codici fiscali italiani.
 * Permette di estrarre informazioni a partire da un codice fiscale.
 * Permette di generare il codice fiscale a partire da una persona
 * Permette di effettuare dei controlli di validità su un codice fiscale
 * Permette di gestire casi di omocodia
 * @package Csi\Utils
 * @example
 * TaxCode::extractSurnamePart(''); // RSS
 * TaxCode::generateSurnamePart(''); // RSS
 * TaxCode::extractCinPart(''); // U
 * TaxCode::extractCin(''); // U
 * TaxCode::hasValidCin(''); // true
 * TaxCode::hasValidCin(''); // false
 * TaxCode::extractBirthPlacePart(''); // H501
 */
class TaxCode
{

    const GENDERS = ['MALE' => 'M', 'FEMALE' => 'F'];
    const VOWELS = ['A', 'E', 'I', 'O', 'U'];

    const LENGTH = 16;
    const SURNAME_INDEX_START = 0;
    const SURNAME_INDEX_END = 2;
    const SURNAME_LENGTH = 3;
    const NAME_INDEX_START = 3;
    const NAME_INDEX_END = 5;
    const NAME_LENGTH = 3;
    const YEAR_INDEX_START = 6;
    const YEAR_INDEX_END = 7;
    const YEAR_LENGTH = 2;
    const MONTH_INDEX = 8;
    const MONTH_LENGTH = 1;
    const DAY_AND_GENDER_INDEX_START = 9;
    const DAY_AND_GENDER_INDEX_END = 10;
    const DAY_AND_GENDER_LENGTH = 2;
    const BIRTH_PLACE_INDEX_START = 11;
    const BIRTH_PLACE_INDEX_END = 14;
    const BIRTH_PLACE_LENGTH = 4;
    const CIN_INDEX = 15;
    const CIN_LENGTH = 1;
    const REGEX = "/^[A-Za-z]{6}[0-9]{2}[A-Za-z][0-9]{2}[A-Za-z][0-9]{3}[A-Za-z]$/";
    // Ogni lettera corrisponde ad un numero di un mese. Es: A = 0 Gennaio, B = 1 Febbraio
    const MONTH_MAP = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
    // Ogni lettera corrisponde ad un resto delle divisione per 26. es A = 0, Z = 25
    const CIN_MOD_MAP = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
    ];
    // Ogni lettera corrisponde alla cifra da sostituire in caso di omocodia. es 0 -> L, 5 -> R
    const OMOCODIA_MAP = ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];
    // Numero massimo di cifre presenti nel codice fiscale:
    //  2 (Anno nascita) + 2 (Giorno nascita + sesso) + 3 (Codice luogo di nascita)
    const OMOCODIA_MAX_LEVEL = 7;
    // Prendiamo i valori associati ad ogni carattere del codice fiscale
    // in base alla loro posizione pari (even) o dispari (odd)
    const CIN_CHAR_MAP = [
        '0' => ['odd' => 1, 'even' => 0],
        '1' => ['odd' => 0, 'even' => 1],
        '2' => ['odd' => 5, 'even' => 2],
        '3' => ['odd' => 7, 'even' => 3],
        '4' => ['odd' => 9, 'even' => 4],
        '5' => ['odd' => 13, 'even' => 5],
        '6' => ['odd' => 15, 'even' => 6],
        '7' => ['odd' => 17, 'even' => 7],
        '8' => ['odd' => 19, 'even' => 8],
        '9' => ['odd' => 21, 'even' => 9],
        'A' => ['odd' => 1, 'even' => 0],
        'B' => ['odd' => 0, 'even' => 1],
        'C' => ['odd' => 5, 'even' => 2],
        'D' => ['odd' => 7, 'even' => 3],
        'E' => ['odd' => 9, 'even' => 4],
        'F' => ['odd' => 13, 'even' => 5],
        'G' => ['odd' => 15, 'even' => 6],
        'H' => ['odd' => 17, 'even' => 7],
        'I' => ['odd' => 19, 'even' => 8],
        'J' => ['odd' => 21, 'even' => 9],
        'K' => ['odd' => 2, 'even' => 10],
        'L' => ['odd' => 4, 'even' => 11],
        'M' => ['odd' => 18, 'even' => 12],
        'N' => ['odd' => 20, 'even' => 13],
        'O' => ['odd' => 11, 'even' => 14],
        'P' => ['odd' => 3, 'even' => 15],
        'Q' => ['odd' => 6, 'even' => 16],
        'R' => ['odd' => 8, 'even' => 17],
        'S' => ['odd' => 12, 'even' => 18],
        'T' => ['odd' => 14, 'even' => 19],
        'U' => ['odd' => 16, 'even' => 20],
        'V' => ['odd' => 10, 'even' => 21],
        'W' => ['odd' => 22, 'even' => 22],
        'X' => ['odd' => 25, 'even' => 23],
        'Y' => ['odd' => 24, 'even' => 24],
        'Z' => ['odd' => 23, 'even' => 25],
    ];


    public static function isVowel($char)
    {
        return in_array($char, self::VOWELS);
    }

    public static function isConsonant($char)
    {
        return !self::isVowel($char);
    }


    public static function isDigit($char)
    {
        return preg_match('/\d/', $char) == 1;
    }


    public static function getConsonants($string)
    {
        $chars = str_split($string);
        return array_filter($chars, 'self::isConsonant', ARRAY_FILTER_USE_BOTH);
    }


    public static function getVowels($string)
    {
        $chars = str_split($string);
        return array_filter($chars, 'self::isVowel', ARRAY_FILTER_USE_BOTH);
    }


    // GENERAZIONE DI UN CODICE FISCALE
    // ---------------------------------------------------------------------------------------------------------------------
    private static function addVowelsIfNeeded(array $result, $string)
    {
        if (count($result) >= 3) {
            return $result;
        }
        $vowels = self::getVowels($string);
        return array_merge($result, $vowels);
    }


    private static function addXIfNeeded(array $result)
    {
        if (count($result) >= 3) {
            return $result;
        }
        return array_merge($result, ['X', 'X', 'X']);
    }


    private static function fillIfNeeded(array $result, $string)
    {
        $result = self::addVowelsIfNeeded($result, $string);
        $result = self::addXIfNeeded($result);
        return $result;
    }


    public static function generateSurnamePart($surname)
    {
        $surname = strtoupper($surname);
        $result = self::getConsonants($surname);
        $result = self::fillIfNeeded($result, $surname);
        $result = implode('', $result);
        $result = substr($result, 0, 3);
        return strtoupper($result);
    }


    public static function generateNamePart($name)
    {
        $name = strtoupper($name);
        $result = self::getConsonants($name);
        if (count($result) >= 4) {
            array_splice($result, 1, 1);
        }
        $result = self::fillIfNeeded($result, $name);
        $result = implode('', $result);
        $result = substr($result, 0, 3);
        return strtoupper($result);
    }


    public static function generateBirthYearPart($year)
    {
        $yearString = (string)$year;
        return substr($yearString, -2);
//    return substr($yearString, strlen($yearString) - 2);
    }

    public static function generateBirthMonthPart($monthNumber)
    {
        return self::MONTH_MAP[(int)$monthNumber];
    }


    public static function generateBirthDayAndGenderPart($day, $gender)
    {
        $result = (int)$day;
        if ($gender === self::GENDERS['FEMALE']) {
            $result += 40;
        }
        return (string)$result;
    }


    public static function generatePartialTaxCode($person)
    {
        $result = self::generateSurnamePart($person['surname'])
            . self::generateNamePart($person['name'])
            . self::generateBirthYearPart($person['birthYear'])
            . self::generateBirthMonthPart($person['birthMonth'])
            . self::generateBirthDayAndGenderPart($person['birthDay'], $person['gender'])
            . strtoupper($person['birthPlaceCode']);

        return $result;
    }


    public static function generateCin($partialTaxCode = '')
    {
        $partialTaxCode = strtoupper($partialTaxCode);
        $partialTaxCodeChars = str_split($partialTaxCode);

        $odd = array_filter($partialTaxCodeChars, function ($char, $index) {
            return $index <= 14 && ($index + 1) % 2 === 1;
        }, ARRAY_FILTER_USE_BOTH);

        $even = array_filter($partialTaxCodeChars, function ($char, $index) {
            return $index <= 14 && ($index + 1) % 2 === 0;
        }, ARRAY_FILTER_USE_BOTH);

        $oddSum = array_reduce($odd, function ($sum, $char) {
            return $sum + self::CIN_CHAR_MAP[$char]['odd'];
        }, 0);

        $evenSum = array_reduce($even, function ($sum, $char) {
            return $sum + self::CIN_CHAR_MAP[$char]['even'];
        }, 0);

        $mod = ($oddSum + $evenSum) % 26;
        return self::CIN_MOD_MAP[$mod];
    }


    public static function generateTaxCode($person)
    {
        $partialTaxCode = self::generatePartialTaxCode($person);
        $cin = self::generateCin($partialTaxCode);
        return $partialTaxCode . $cin;
    }


    public static function generateAllParts($person)
    {
        $partialTaxCode = self::generatePartialTaxCode($person);
        return [
            'surname' => self::generateSurnamePart($person['surname']),
            'name' => self::generateNamePart($person['name']),
            'birthYear' => self::generateBirthYearPart($person['birthYear']),
            'birthMonth' => self::generateBirthMonthPart($person['birthMonth']),
            'birthDayAndGender' => self::generateBirthDayAndGenderPart($person['birthDay'], $person['gender']),
            'partialTaxCode' => $partialTaxCode,
            'cin' => self::generateCin($partialTaxCode),
            'taxCode' => self::generateTaxCode($person)
        ];
    }


    // PARSING DI UN CODICE FISCALE
    // ---------------------------------------------------------------------------------------------------------------------
    public static function extractSurnamePart($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        return substr($taxCode, self::SURNAME_INDEX_START, self::SURNAME_LENGTH);
    }


    public static function extractNamePart($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        return substr($taxCode, self::NAME_INDEX_START, self::NAME_LENGTH);
    }


    public static function extractBirthYearPart($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        return substr($taxCode, self::YEAR_INDEX_START, self::YEAR_LENGTH);
    }


    public static function extractBirthMonthPart($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        return substr($taxCode, self::MONTH_INDEX, self::MONTH_LENGTH);
    }


    public static function extractBirthDayAndGenderPart($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        return substr($taxCode, self::DAY_AND_GENDER_INDEX_START, self::DAY_AND_GENDER_LENGTH);
    }


    public static function extractBirthPlaceCodePart($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        return substr($taxCode, self::BIRTH_PLACE_INDEX_START, self::BIRTH_PLACE_LENGTH);
    }


    public static function extractPartialTaxCode($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        $chars = str_split($taxCode);
        array_splice($chars, self::CIN_INDEX, 1);
        return implode('', $chars);
    }


    public static function extractCinPart($taxCode = '')
    {
        $taxCode = strtoupper($taxCode);
        return substr($taxCode, self::CIN_INDEX, self::CIN_LENGTH);
    }


    public static function extractAllParts($taxCode = '')
    {
        return [
            'surname' => self::extractSurnamePart($taxCode),
            'name' => self::extractNamePart($taxCode),
            'birthYear' => self::extractBirthYearPart($taxCode),
            'birthMonth' => self::extractBirthMonthPart($taxCode),
            'birthDayAndGender' => self::extractBirthDayAndGenderPart($taxCode),
            'birthPlaceCode' => self::extractBirthPlaceCodePart($taxCode),
            'partialTaxCode' => self::extractPartialTaxCode($taxCode),
            'cin' => self::extractCinPart($taxCode),
            'gender' => self::getGender($taxCode),
            'day' => self::getDay($taxCode),
        ];
    }


    public static function getGender($taxCode = '')
    {
        $dayAndGenderPart = self::extractBirthDayAndGenderPart($taxCode);
        $number = (int)$dayAndGenderPart;
        if (!is_numeric($number)) {
            return null;
        }
        return $number > 40 ? self::GENDERS['FEMALE'] : self::GENDERS['MALE'];
    }


    public static function getDay($taxCode = '')
    {
        $gender = self::getGender($taxCode);
        $result = (int)self::extractBirthDayAndGenderPart($taxCode);
        if ($gender === self::GENDERS['FEMALE']) {
            $result -= 40;
        }
        return $result;
    }


    // OMOCODIA
    // ---------------------------------------------------------------------------------------------------------------------
    private static function getOneLevelAlternativeTaxCodes($taxCode = '')
    {

        $result = [];
        // Il carattere di controllo deve essere ricalcolato una volta che viene sostituita una cifra.
        $partialTaxCode = self::extractPartialTaxCode($taxCode);
        $chars = str_split($partialTaxCode);

        foreach ($chars as $index => $char) {
            if (!self::isDigit($char)) {
                return;
            }
            $omocodiaChar = self::OMOCODIA_MAP[(int)$char];
            $alternative = str_split($partialTaxCode);
            $alternative[$index] = $omocodiaChar;
            $alternative = implode('', $alternative);
            $newCin = self::generateCin($alternative);
            array_unshift($result, $alternative . $newCin);
        }

        return $result;
    }


    public static function getLevelAlternativeTaxCodes($taxCode = '', $level = 1)
    {
        if ($level <= 0 || $level > self::OMOCODIA_MAX_LEVEL) {
            // Invalid Omocodia level
        }
        $alternatives = self::getAlternativeTaxCodes($taxCode, $level);
        return $alternatives[$level];
    }


    public static function getAlternativeTaxCodes($taxCode = '', $maxLevel = self::OMOCODIA_MAX_LEVEL, $flat = false)
    {

        $maxLevel = min($maxLevel, self::OMOCODIA_MAX_LEVEL);
        $result = [
            '1' => self::getOneLevelAlternativeTaxCodes($taxCode)
        ];

        for ($level = 2; $level <= $maxLevel; $level++) {
            $result[$level] = [];
            $previousLevel = $result[$level - 1];

            foreach ($previousLevel as $index => $_taxCode) {
                $result[$level] = array_merge($result[$level], self::getOneLevelAlternativeTaxCodes($_taxCode));
            }
        }

        if (!$flat) {
            return $result;
        }
        $_result = [];
        for ($level = 1; $level <= $maxLevel; $level++) {
            $level = array_merge($_result, $result[$level]);
        }
        return $_result;
    }


    public static function getOmocodiaLevel($taxCode = '')
    {
        $partialTaxCode = self::extractPartialTaxCode($taxCode);
        $partialTaxCodeChars = str_split($partialTaxCode);
        $taxCodeDigits = array_filter($partialTaxCodeChars, 'self::isDigit', ARRAY_FILTER_USE_BOTH);
        $digitCounts = count($taxCodeDigits);
        return self::OMOCODIA_MAX_LEVEL - $digitCounts;
    }


    // CONTROLLI DI VALIDITA'
    // ---------------------------------------------------------------------------------------------------------------------
    public static function getExpectedCin($taxCode = '')
    {
        return self::generateCin(self::extractPartialTaxCode($taxCode));
    }


    public static function hasValidLength($taxCode = '')
    {
        return $taxCode && count($taxCode) === self::LENGTH;
    }


    public static function hasValidCin($taxCode = '')
    {
        return self::extractCinPart($taxCode) === self::getExpectedCin($taxCode);
    }


    public static function hasValidForm($taxCode = '')
    {
        return preg_match(self::REGEX, $taxCode) == 1;
    }


}