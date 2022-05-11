<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $codice
 * @property string $descrizione
 */
class FseAccessDecodeService extends Model
{
    protected $table = 'lms_fse_accessi_decodifiche_servizi';

    protected $casts = [
    ];

    protected $hidden = [
    ];

    protected $appends = [
    ];


    // RELAZIONI
    // -----------------------------------------------------------------------------------------------------------------

    // ALIAS
    // -----------------------------------------------------------------------------------------------------------------
}