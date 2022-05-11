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
 * @property string $codice_fiscale
 * @property bool $tutorial_home_visualizzato
 * @property bool $tutorial_fse_visualizzato
 * @property \DateTime $data_creazione
 * @property \DateTime $data_aggiornamento
 * @property \DateTime $data_cancellazione
 */
class UserInformation extends Model
{
    use SoftDeletes;

    protected $table = 'lms_utente_informazioni';

    const CREATED_AT = 'data_creazione';
    const UPDATED_AT = 'data_aggiornamento';
    const DELETED_AT = 'data_cancellazione';

    protected $fillable = [
        'tutorial_home_visualizzato',
        'tutorial_fse_visualizzato'
    ];

    protected $casts = [
        'tutorial_home_visualizzato' => 'boolean',
        'tutorial_fse_visualizzato' => 'boolean',
        'data_creazione' => 'datetime:' . DATE_ATOM,
        'data_aggiornamento' => 'datetime:' . DATE_ATOM,
        'data_cancellazione' => 'datetime:' . DATE_ATOM,
    ];

    protected $hidden = [
        'data_cancellazione',
    ];
}