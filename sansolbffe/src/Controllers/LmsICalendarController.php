<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Controllers;


use Assert\Assert;
use Assert\AssertionFailedException;
use Csi\Utils\Utils;
use Eluceo\iCal\Component\Calendar;
use Eluceo\iCal\Component\Event;
use Eluceo\iCal\Property\Event\Geo;
use Eluceo\iCal\Property\Event\RecurrenceRule;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Ramsey\Uuid\Uuid;

class LmsICalendarController
{

    public function download(ServerRequestInterface $req, ResponseInterface $res, array $args)
    {
        $FREQ_ENUM = [
            RecurrenceRule::FREQ_YEARLY,
            RecurrenceRule::FREQ_MONTHLY,
            RecurrenceRule::FREQ_WEEKLY,
            RecurrenceRule::FREQ_DAILY,
            RecurrenceRule::FREQ_HOURLY,
            RecurrenceRule::FREQ_MINUTELY,
            RecurrenceRule::FREQ_SECONDLY,

            RecurrenceRule::WEEKDAY_SUNDAY,
            RecurrenceRule::WEEKDAY_MONDAY,
            RecurrenceRule::WEEKDAY_TUESDAY,
            RecurrenceRule::WEEKDAY_WEDNESDAY,
            RecurrenceRule::WEEKDAY_THURSDAY,
            RecurrenceRule::WEEKDAY_FRIDAY,
            RecurrenceRule::WEEKDAY_SATURDAY,
        ];

        $query = $req->getQueryParams();
        $filename = $query['file_nome'] ?? 'evento';
        $from = $query['da'] ?? null;
        $to = $query['a'] ?? null;
        $noTime = $query['giornata_intera'] ?? false;
        $noTime = strcasecmp($noTime, 'true') === 0;
        $name = $query['nome'] ?? null;
        $description = $query['descrizione'] ?? null;
        $location = $query['luogo'] ?? null;
        $lat = $query['lat'] ?? null;
        $lon = $query['lon'] ?? null;
        $recurrenceFreq = $query['frequenza'] ?? null;
        $recurrenceInterval = $query['intervallo'] ?? null;
        $recurrenceCount = $query['ripetizioni'] ?? null;

        if($lat !== null) $lat = (float) $lat;
        if($lon !== null) $lon = (float) $lat;
        if($recurrenceInterval !== null) $recurrenceInterval = (int) $recurrenceInterval;
        if($recurrenceCount !== null) $recurrenceCount = (int) $recurrenceCount;

        // A questo punto siamo sicuri che "eventi" sia un array non vuoto
        try {
            $assert = Assert::lazy()->tryAll();
            $assert = $assert->that($from, 'da')->notEmpty()->string();
            $assert = $assert->that($to, 'a')->notEmpty()->string();
            $assert = $assert->that($noTime, 'giornata_intera')->nullOr()->boolean();
            $assert = $assert->that($name, 'nome')->notEmpty()->string();
            $assert = $assert->that($description, 'descrizione')->nullOr()->string();
            $assert = $assert->that($location, 'luogo')->nullOr()->string();
            $assert = $assert->that($lat, 'lat')->nullOr()->numeric()->between(-90, 90);
            $assert = $assert->that($lon, 'lon')->nullOr()->numeric()->between(-180, 180);
            $assert = $assert->that($recurrenceFreq, 'frequenza')->nullOr()->string()->choice($FREQ_ENUM);
            $assert = $assert->that($recurrenceInterval, 'intervallo')->nullOr()->integer()->min(1);
            $assert = $assert->that($recurrenceCount, 'ripetizioni')->nullOr()->integer()->min(1);
            $assert->verifyNow();
        } catch (AssertionFailedException $e) {
            throw $e;
            // return $res->withStatus(400)->withJson($e->getMessage());
        }

        // A questo punto siamo sicuri che il payload sia formato bene
        $calendar = new Calendar(Uuid::uuid4()->toString());

        $calendarEvent = new Event();
        $calendarEvent->setCreated(new \DateTime());
        $calendarEvent->setDtStamp(new \DateTime($from));
        $calendarEvent->setDtStart(new \DateTime($from));
        $calendarEvent->setDtEnd(new \DateTime($to));
        $calendarEvent->setSummary($name);

        if ($noTime) {
            $calendarEvent->setNoTime($noTime);
        }

        if ($description) {
            $calendarEvent->setDescriptionHTML($description);
        }

        if ($location) {
            $calendarEvent->setLocation($location);
        }

        if ($lat && $lon) {
            $geo = new Geo($lat, $lon);
            $calendarEvent->setGeoLocation($geo);
        }

        if ($recurrenceFreq || $recurrenceInterval || $recurrenceCount) {
            $calendarRecurrenceRule = new RecurrenceRule();

            if ($recurrenceFreq) {
                $calendarRecurrenceRule->setFreq($recurrenceFreq);
            }

            if ($recurrenceInterval) {
                $calendarRecurrenceRule->setInterval($recurrenceInterval);
            }

            if ($recurrenceCount) {
                $calendarRecurrenceRule->setCount($recurrenceCount);
            }

            $calendarEvent->addRecurrenceRule($calendarRecurrenceRule);
        }

        $calendar->addComponent($calendarEvent);


        $content = $calendar->render();
        $stream = Utils::string2Stream($content);
        $stream = new \Slim\Http\Stream($stream);

        return $res
            ->withHeader('Content-Disposition', 'attachment; filename="' . $filename . '.ics"')
            ->withHeader('Content-Type', ' text/calendar; charset=utf-8')
            ->withHeader('Content-Length', strlen($content))
            ->withHeader('Expires', '0')
            ->withHeader('Pragma', 'no-cache')
            ->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->withBody($stream);
    }

}