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
class ApplicationCategory extends Model
{
    protected $table = 'lms_applicazioni_categorie';

    protected $primaryKey = 'codice';
    public $timestamps = false;
}