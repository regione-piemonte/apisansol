<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

use Csi\Controllers\ApisanPatController;

$app->group('/apisanesenpat', function () {
    $this->get('/api/v1/tipologie-esenzione', ApisanPatController::class . ':tipologie_esenzione');
    $this->get('/api/v1/stati-esenzione', ApisanPatController::class . ':stati_esenzione');
    $this->get('/api/v1/cittadini/{cit_id}/esenzioni/{esenzione_id}/annullamento/motivazioni', ApisanPatController::class . ':motivazioni_annullamento');
    $this->get('/api/v1/cittadini/{cit_id}/esenzioni/{esenzione_id}/revoca/motivazioni', ApisanPatController::class . ':motivazioni_revoca');
    $this->get('/api/v1/disclaimer-iscrizione-malattie-rare', ApisanPatController::class . ':disclaimer_malattie_rare');
    $this->get('/api/v1/disclaimer-trattamento-dati', ApisanPatController::class . ':disclaimer_trattamento_dati');
    $this->get('/api/v1/tipologie-esenzione/{tipologia_codice}/tipologie-documento', ApisanPatController::class . ':documenti_tipologie');
    $this->get('/api/v1/tipologie-esenzione/{tipologia_codice}/malattie', ApisanPatController::class . ':malattie');
    $this->get('/api/v1/tipologie-esenzione/{tipologia_codice}/esenzioni', ApisanPatController::class . ':esenzioni');
    $this->get('/api/v1/tipologie-esenzione/{tipologia_codice}/esenzioni/{esenzione_codice}', ApisanPatController::class . ':dettaglio_esenzione');
    $this->get('/api/v1/tipologie-esenzione/{tipologia_codice}/malattie/{malattia_codice}', ApisanPatController::class . ':dettaglio_malattia');
    $this->get('/api/v1/tipologie-invalidita', ApisanPatController::class . ':tipologie_invalidita');
    $this->any('/{routes:.+}', ApisanPatController::class . ':proxy');
});