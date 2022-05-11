<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Models;


use Carbon\Carbon;
use DateInterval;
use DateTime;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $cf
 * @property string $canale
 * @property string $codice
 * @property \DateTime $data_creazione
 * @property \DateTime $data_scadenza
 */
class OtpOrm extends Model
{

    const MAX_DAILY_ATTEMPTS = 3;
    const DEFAULT_TTL = 'PT30M'; // 30 Minuti
    const SMS = 'sms';
    const EMAIL = 'email';

    protected $table = 'lms_unp_otp';

    const CREATED_AT = 'data_creazione';
    const UPDATED_AT = null;

    protected $casts = [
        'data_creazione' => 'datetime:' . DATE_ATOM,
        'data_scadenza' => 'datetime:' . DATE_ATOM,
    ];

    protected $hidden = [];

    protected $appends = [];

    // RELAZIONI
    // -----------------------------------------------------------------------------------------------------------------

    // ALIAS
    // -----------------------------------------------------------------------------------------------------------------

    // OVERRIDES
    // -----------------------------------------------------------------------------------------------------------------
    /**
     * Sovrascriviamo la getHidden di Laravel per nascondere il campo "codice" solo quando
     * siamo in ambiente di produzione
     * @return array
     */
    public function getHidden()
    {
        $result = parent::getHidden();
        if(IS_PRODUCTION) array_push($result, 'codice');
        return $result;
    }

    // METODI IN PIU'
    // -----------------------------------------------------------------------------------------------------------------
    public static function getRandomCode()
    {
        // Non permettiamo numeri del tipo '01234' o '00001'
        // dal momento che l'input di tipo 'number' non accetterebbe gli zeri (0) prima del primo valore
        // e risulterebbe in un codice errato.
        // L'input di tipo 'number' è necessario dal momento che permette all'utente di avere una keyboard adatta
        // all'inserimento del codice
        return mt_rand(10000, 99999);
        // return sprintf("%05d", mt_rand(1, 999999));
    }

    public static function getDefaultTTL()
    {
        return new DateInterval(self::DEFAULT_TTL);
    }

    public static function getEndDate()
    {
        $expiration_datetime = new DateTime();
        $interval = self::getDefaultTTL();
        $expiration_datetime->add($interval);
        return $expiration_datetime;
    }

    /**
     * Limita l'azione delle query ai soli OTP considerati "obsoleti",
     * cioè gli OTP che non servono più e potrebbero essere cancellati
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeObsolete($query){
        $max = Carbon::now()->subDays(2);
        return $query->whereDate('data_scadenza', '<=', $max->toDateString());
    }

}