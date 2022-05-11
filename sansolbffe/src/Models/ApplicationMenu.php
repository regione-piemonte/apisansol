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
 * @property string $descrizione
 * @property int $posizione
 * @property string $url
 * @property bool $visibile_menu_mobile
 * @property bool $visibile_menu_desktop
 * @property int $applicazione_id
 */
class ApplicationMenu extends Model
{

    protected $table = 'lms_applicazioni_menu';

    public $timestamps = false;

    protected $casts = [
        'visibile_menu_mobile' => 'boolean',
        'visibile_menu_desktop' => 'boolean',
    ];

    protected $hidden = [
    ];

    protected $appends = [
    ];

    // RELAZIONI
    // -----------------------------------------------------------------------------------------------------------------
    public function applicazione()
    {
        return $this->belongsTo(Application::class, 'applicazione_id', 'id');
    }


    // ALIAS
    // -----------------------------------------------------------------------------------------------------------------
}