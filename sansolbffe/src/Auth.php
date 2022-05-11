<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi;

/**
 * @package Csi
 * Questa classe permette di centralizzare la gestione dell'autenticazione.
 * Fornisce quindi anche un unico punto da modificare per testare credenziali prestabilite oppure per sviluppare in locale.
 */
class Auth
{

    /**
     * @return bool True se esiste una sessione Shibboleth attiva, false altrimenti
     */
    public static function isShibbolethSessionEnabled()
    {
        return !empty($_SERVER[HEADER_FIELD_SHIB_CF]);
    }


    /**
     * Ottiene i dati dell'utente dai cookie di sessione di shibboleth.
     * @return array L'identità dell'utente loggato
     */
    public static function getShibbolethIdentity()
    {

        $identity = [
            'nome' => $_SERVER[HEADER_FIELD_SHIB_NOME],
            'cognome' => $_SERVER[HEADER_FIELD_SHIB_COGNOME],
            'cf' => $_SERVER[HEADER_FIELD_SHIB_CF],
            'autenticazione_valida' => $_SERVER[HEADER_FIELD_SHIB_RISCONTRO] !== 'N',
            'autenticazione_riscontro' => $_SERVER[HEADER_FIELD_SHIB_RISCONTRO],
            'autenticazione_metodo' => isset($_SERVER[HEADER_FIELD_SHIB_COMMUNITY]) ? $_SERVER[HEADER_FIELD_SHIB_COMMUNITY] : null,
            'autenticazione_livello' => isset($_SERVER[HEADER_FIELD_SHIB_LIVELLO]) ? $_SERVER[HEADER_FIELD_SHIB_LIVELLO] : null,
        ];

        return $identity;
    }

}