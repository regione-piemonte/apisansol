<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Utils;


use ReCaptcha\ReCaptcha;
use ReCaptcha\RequestMethod;
use ReCaptcha\RequestMethod\Curl;
use ReCaptcha\RequestParameters;

class CsiReCaptchaPostCurl implements RequestMethod
{
    /**
     * Curl connection to the reCAPTCHA service
     * @var Curl
     */
    private $curl;

    /**
     * URL for reCAPTCHA siteverify API
     * @var string
     */
    private $siteVerifyUrl;

    /**
     * Only needed if you want to override the defaults
     *
     * @param Curl $curl Curl resource
     * @param string $siteVerifyUrl URL for reCAPTCHA siteverify API
     */
    public function __construct(Curl $curl = null, $siteVerifyUrl = null)
    {
        $this->curl = (is_null($curl)) ? new Curl() : $curl;
        $this->siteVerifyUrl = (is_null($siteVerifyUrl)) ? ReCaptcha::SITE_VERIFY_URL : $siteVerifyUrl;
    }

    /**
     * Submit the cURL request with the specified parameters.
     *
     * @param RequestParameters $params Request parameters
     * @return string Body of the reCAPTCHA response
     */
    public function submit(RequestParameters $params)
    {
        $handle = $this->curl->init($this->siteVerifyUrl);

        $options = [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $params->toQueryString(),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ],
            CURLINFO_HEADER_OUT => false,
            CURLOPT_HEADER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_FAILONERROR => true,
        ];

        if (defined('CURLOPT_IPRESOLVE') && defined('CURL_IPRESOLVE_V4')){
            $options[CURLOPT_IPRESOLVE] = CURL_IPRESOLVE_V4;
        }

//        if(USE_PROXY){
            $options[CURLOPT_PROXY] = PROXY;
//            $options['CURLOPT_SSL_VERIFYPEER'] = false;
//        }

        $this->curl->setoptArray($handle, $options);

        $response = $this->curl->exec($handle);


        if ($response !== false) {
            $this->curl->close($handle);
            return $response;
        }

        $error = curl_error($handle);
        $info = curl_getinfo($handle);
        $this->curl->close($handle);

        $result = [
            'success' => false,
            'error-codes' => [
                ReCaptcha::E_CONNECTION_FAILED,
                $options,
                $error,
                $info,
            ]
        ];

        return json_encode($result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
//        return '{"success": false, "error-codes": ["'.ReCaptcha::E_CONNECTION_FAILED.'", "'.$error.'"]}';
    }
}