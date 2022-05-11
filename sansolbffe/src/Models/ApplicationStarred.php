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
 */
class ApplicationStarred extends Model
{
    protected $table = 'lms_applicazioni_preferite';

    public $timestamps = false;

    protected $casts = [];
    protected $hidden = [];
}