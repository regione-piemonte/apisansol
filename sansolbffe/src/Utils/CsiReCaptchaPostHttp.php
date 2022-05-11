<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Utils;


use ReCaptcha\ReCaptcha;
use ReCaptcha\RequestMethod;
use ReCaptcha\RequestParameters;

class CsiReCaptchaPostHttp implements RequestMethod
{

    /**
     * URL for reCAPTCHA siteverify API
     * @var string
     */
    private $siteVerifyUrl;

    /**
     * Only needed if you want to override the defaults
     *
     * @param string $siteVerifyUrl URL for reCAPTCHA siteverify API
     */
    public function __construct($siteVerifyUrl = null)
    {
        $this->siteVerifyUrl = (is_null($siteVerifyUrl)) ? ReCaptcha::SITE_VERIFY_URL : $siteVerifyUrl;
    }

    /**
     * Submit the POST request with the specified parameters.
     *
     * @param RequestParameters $params Request parameters
     * @return string Body of the reCAPTCHA response
     */
    public function submit(RequestParameters $params)
    {
        $options = [
            'ssl' => [],
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => $params->toQueryString(),
            ],
        ];

        if (USE_PROXY) {
            $options['http']['proxy'] = PROXY;
            $options['http']['request_fulluri'] = true;
//            $options['ssl']['verify_peer'] = false;
        }

        $context = stream_context_create($options);
        $response = file_get_contents($this->siteVerifyUrl, false, $context);

        if ($response !== false) {
            return $response;
        }

        return '{"success": false, "error-codes": ["' . ReCaptcha::E_CONNECTION_FAILED . '"]}';
    }
}