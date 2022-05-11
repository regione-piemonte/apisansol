<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Utils;


use Csi\Auth;

class LoggingUtils
{

    public static function php2HtmlHeaderName($phpHeaderName)
    {
        $htmlHeaderName = $phpHeaderName;
        $htmlHeaderName = preg_replace('/^HTTP_/', '', $htmlHeaderName);
        $htmlHeaderName = preg_replace('/_/', '-', $htmlHeaderName);
        $htmlHeaderName = ucwords(strtolower($htmlHeaderName), '-');
        return $htmlHeaderName;
    }


    public static function php2HtmlHeaderValue($phpHeaderValue)
    {
        return implode(', ', $phpHeaderValue);
    }


    public static function php2HtmlHeaders($phpHeaders)
    {

        $result = [];

        foreach ($phpHeaders as $phpHeaderName => $phpHeaderValue) {
            $name = static::php2HtmlHeaderName($phpHeaderName);
            $value = static::php2HtmlHeaderValue($phpHeaderValue);
            $result[$name] = $value;
        }

        ksort($result);
        return $result;
    }


    // Controlliamo se possiamo loggare le richieste/risposte dell'utente
    public static function isUserLoggable()
    {
        if (Auth::isShibbolethSessionEnabled()) {
            $identity = Auth::getShibbolethIdentity();

            foreach (LOGS_IGNORABLE_USERS as $user) {
                if ($identity['cf'] == $user['cf']) {
                    return false;
                }
            }
        }

        return true;
    }


}