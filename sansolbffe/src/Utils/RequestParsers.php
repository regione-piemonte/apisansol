<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Utils;


use Psr\Http\Message\ServerRequestInterface;

class RequestParsers
{


    /**
     * Trasforma una query string del tipo:
     * nome_query_param = +ord1, -ord2, ord3
     *
     * in:
     * [
     *   ['field' => 'ord1', 'direction' => 'asc'],
     *   ['field' => 'ord2', 'direction' => 'desc']
     *   ['field' => 'ord3', 'direction' => 'asc']
     * ]
     *
     * @param ServerRequestInterface $req
     * @param string $paramName
     * @return array
     */
    public static function getOrderBy(ServerRequestInterface $req, $paramName = 'ordinamento')
    {

        $query = $req->getQueryParams();
        if(!key_exists($paramName, $query)) return [];

        $orderBy = $query[$paramName] ?? '';
        $orderBy = explode(',', $orderBy);
        $result = [];

        foreach ($orderBy as $order) {
            $order = trim($order);
            $direction = 'asc';

            if (Utils::startsWith($order, '-')) {
                $direction = 'desc';
            }

            $order = str_replace(['-', '+'], '', $order);
            array_push($result, ['field' => $order, 'direction' => $direction]);
        }

        return $result;
    }


}