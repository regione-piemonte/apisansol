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
 * @property string $descrizione
 * @property string $descrizione_estesa
 * @property int $posizione
 * @property string $url
 * @property string $icona_url
 * @property bool $vecchio
 * @property bool $pubblico
 * @property bool $visibile_home_mobile
 * @property bool $visibile_home_desktop
 * @property bool $visibile_menu_mobile
 * @property bool $visibile_menu_desktop
 * @property bool $in_pubblicazione
 * @property \DateTime $data_pubblicazione_prevista
 * @property string|null $deleghe_codice
 * @property bool $deleghe_supportate
 * @property int $deleghe_numero_giorni
 * @property bool $fse_consigliato
 * @property bool $fse_obbligatorio
 * @property bool $notifiche_supportate
 * @property string $notifiche_codice
 * @property int $numero_accessi
 * @property int $gruppo_id
 * @property int $categoria_id
 * @property int $assistenza_codice
 * @property \DateTime manutenzione_data_inizio
 * @property \DateTime manutenzione_data_fine
 * @property bool $albero_aiuti_visibile
 * @property string $portale_codice
 * @property bool $soddisfazione_cliente_visibile
 * @property string $soddisfazione_cliente_url
 * @property \DateTime $data_creazione
 * @property \DateTime $data_aggiornamento
 * @property \DateTime $data_cancellazione
 */
class Application extends Model
{
    use SoftDeletes;

    protected $table = 'lms_applicazioni';

    const CREATED_AT = 'data_creazione';
    const UPDATED_AT = 'data_aggiornamento';
    const DELETED_AT = 'data_cancellazione';

    protected $casts = [
        'vecchio' => 'boolean',
        'pubblico' => 'boolean',
        'visibile_home_mobile' => 'boolean',
        'visibile_home_desktop' => 'boolean',
        'visibile_menu_mobile' => 'boolean',
        'in_pubblicazione' => 'boolean',
        'visibile_menu_desktop' => 'boolean',
        'data_pubblicazione_prevista' => 'datetime:' . DATE_ATOM,
        'deleghe_supportate' => 'boolean',
        'fse_consigliato' => 'boolean',
        'fse_obbligatorio' => 'boolean',
        'notifiche_supportate' => 'boolean',
        'albero_aiuti_visibile' => 'boolean',
        'soddisfazione_cliente_visibile' => 'boolean',
        'data_creazione' => 'datetime:' . DATE_ATOM,
        'data_aggiornamento' => 'datetime:' . DATE_ATOM,
        'manutenzione_data_inizio' => 'datetime:' . DATE_ATOM,
        'manutenzione_data_fine' => 'datetime:' . DATE_ATOM,
    ];

    protected $hidden = [
//        'deleghe_codice',
//        'deleghe_supportate',
//        'deleghe_numero_giorni',
//        'notifiche_supportate',
//        'fse_consigliato',
//        'fse_obbligatorio',
//        'notifiche_codice',
        'data_cancellazione',
    ];

    protected $appends = [
        'codice_servizio',
        'delegabile',
        'numero_giorni_delegabile',
        'notificabile',
        'arruolabile',
        'obbligatorio_arruolamento',
    ];


    // RELAZIONI
    // -----------------------------------------------------------------------------------------------------------------
    public function categoria()
    {
        return $this->belongsTo(ApplicationCategory::class, 'categoria_id', 'codice');
    }

    public function gruppo()
    {
        return $this->belongsTo(ApplicationGroup::class, 'gruppo_id', 'codice');
    }

    public function delegabili()
    {
        return $this->hasMany(Delegable::class, 'applicazione_id', 'id');
    }

    public function menu()
    {
        return $this->hasMany(ApplicationMenu::class, 'applicazione_id', 'id');
    }

    // ALIAS
    // -----------------------------------------------------------------------------------------------------------------
    public function getCodiceServizioAttribute()
    {
        return $this->deleghe_codice;
    }

    public function getDelegabileAttribute()
    {
        return $this->deleghe_supportate;
    }

    public function getNumeroGiorniDelegabileAttribute()
    {
        return $this->deleghe_numero_giorni;
    }

    public function getNotificabileAttribute()
    {
        return $this->notifiche_supportate;
    }

    public function getArruolabileAttribute()
    {
        return $this->fse_consigliato;
    }

    public function getObbligatorioArruolamentoAttribute()
    {
        return $this->fse_obbligatorio;
    }
}