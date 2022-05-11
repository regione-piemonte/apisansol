<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Models;


use Illuminate\Database\Eloquent\Model;

/**
 * @property int $codice
 * @property string $descrizione
 */
class ApplicationGroup extends Model
{
    protected $table = 'lms_applicazioni_gruppi';

    protected $primaryKey = 'codice';
    public $timestamps = false;
}