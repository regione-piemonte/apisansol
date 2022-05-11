<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Log;

use Monolog\Formatter\FormatterInterface;

class MonologFormatterPlain implements FormatterInterface
{

    public function format(array $record)
    {
        return $record['message'];
    }

    public function formatBatch(array $records)
    {
        foreach ($records as $key => $record) {
            $records[$key] = $this->format($record);
        }

        return $records;
    }

}
