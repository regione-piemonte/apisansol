<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $applicazione_id
 * @property string $codice_fiscale
 * @property bool $soddisfazione_cliente_visualizzato
 * @property \DateTime $data_creazione
 * @property \DateTime $data_aggiornamento
 * @property \DateTime $data_cancellazione
 */
class UserApplication extends Model
{
    protected $table = 'lms_utente_applicazioni';

    const CREATED_AT = 'data_creazione';
    const UPDATED_AT = 'data_aggiornamento';
    const DELETED_AT = 'data_cancellazione';

    protected $casts = [
        'soddisfazione_cliente_visualizzato' => 'boolean',
    ];
    protected $hidden = [
        'data_creazione',
        'data_aggiornamento',
        'data_cancellazione'
    ];
}