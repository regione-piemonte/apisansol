<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $codice
 * @property string $deleghe_codice
 * @property int $numero_giorni
 * @property bool $gruppo_fse
 * @property bool $delega_forte
 * @property bool $delega_debole
 * @property string $delega_forte_descrizione
 * @property string $delega_debole_descrizione
 * @property string $delega_forte_descrizione_estesa
 * @property string $delega_debole_descrizione_estesa
 * @property \DateTime $data_creazione
 * @property \DateTime $data_aggiornamento
 * @property \DateTime $data_cancellazione
 */
class Delegable extends Model
{
    use SoftDeletes;

    protected $table = 'lms_delegabili';

    const CREATED_AT = 'data_creazione';
    const UPDATED_AT = 'data_aggiornamento';
    const DELETED_AT = 'data_cancellazione';

    protected $casts = [
        'gruppo_fse' => 'boolean',
        'delega_forte' => 'boolean',
        'delega_debole' => 'boolean',
        'data_creazione' => 'datetime:' . DATE_ATOM,
        'data_aggiornamento' => 'datetime:' . DATE_ATOM,
        'data_cancellazione' => 'datetime:' . DATE_ATOM,
    ];

    protected $hidden = [
        'data_cancellazione',
    ];

    protected $appends = [];

    // RELAZIONI
    // -----------------------------------------------------------------------------------------------------------------
    public function applicazione()
    {
        return $this->belongsTo(Application::class, 'applicazione_id', 'id');
    }
}