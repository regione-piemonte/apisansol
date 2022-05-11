<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Models;


use DateInterval;
use DateTime;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nome_app
 * @property string $configurazione
 * @property \DateTime $data_creazione
 * @property \DateTime $data_modifica
 */
class FrontEndConfig extends Model
{

    protected $table = 'lms_front_end_config';

    const CREATED_AT = 'data_creazione';
    const UPDATED_AT = 'data_modifica';

    protected $casts = [
        'data_creazione' => 'datetime:' . DATE_ATOM,
        'data_modifica' => 'datetime:' . DATE_ATOM,
    ];

    protected $hidden = [];

    protected $appends = [];

    // RELAZIONI
    // -----------------------------------------------------------------------------------------------------------------

    // ALIAS
    // -----------------------------------------------------------------------------------------------------------------

    // OVERRIDES
    // -----------------------------------------------------------------------------------------------------------------
    public function toArray()
    {
        $array = parent::toArray();

        if (!empty($this->configurazione)) {
            $array['configurazione'] = json_decode($this->configurazione);
        }

        return $array;
    }


    // METODI IN PIU'
    // -----------------------------------------------------------------------------------------------------------------
}