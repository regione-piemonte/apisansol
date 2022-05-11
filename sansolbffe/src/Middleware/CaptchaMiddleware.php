<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi\Middleware;


use Csi\Auth;
use Csi\Utils\CsiReCaptchaPostCurl;
use Csi\Utils\Utils;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use ReCaptcha\ReCaptcha;

class CaptchaMiddleware
{


    public function __construct()
    {
    }


    public static function must_check_captcha(ServerRequestInterface $request)
    {
        $is_logged = Auth::isShibbolethSessionEnabled();

        // Per gli utenti loggati non c'è mai il controllo del captcha
        if ($is_logged) {
            return false;
        }

        $method = $request->getMethod();
        $url = $request->getRequestTarget();

        return Utils::arrayAny(CAPTCHA_ENDPOINTS, function($e) use ($method, $url) {
            return  strtoupper($e['method']) === strtoupper($method) && preg_match($e['pattern'], $url) === 1;
        });
    }


    // Chiede al servizio di recaptcha se il token è valido e se l'utente che lo ha generato è umano
    public static function check_captcha($token)
    {
        $client_ip = $_SERVER['REMOTE_ADDR'];
//        $request_method = new CsiReCaptchaPostHttp();
        $request_method = new CsiReCaptchaPostCurl();
        $recaptcha = new ReCaptcha(RE_CAPTCHA_SECRET, $request_method);
//        $recaptcha = new ReCaptcha(RE_CAPTCHA_SECRET);
        $resp = $recaptcha->verify($token, $client_ip);
        return $resp;
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
    {

        // Se il check del captcha non è necessario semplicemente non facciamo nulla
        if (!self::must_check_captcha($request)) {
            return $next($request, $response);
        }

        // altrimenti controlliamo se il captcha è valido prima di andare avanti
        $token = $request->getParam('captcha_token');
        $resp = self::check_captcha($token);

        if ($resp->isSuccess()) {
            $response = $next($request, $response);
        } else {
            $errors = $resp->getErrorCodes();
            $response = $response->withStatus(400)->withJson($errors);
        }

        return $response;
    }
}