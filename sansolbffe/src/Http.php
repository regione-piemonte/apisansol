<?php
/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

namespace Csi;

use Csi\Log\GuzzleMiddlewareRequestCurl;
use Csi\Log\GuzzleMiddlewareResponseHeaderCleaner;
use Csi\Log\GuzzleMiddlewareTiming;
use Exception;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\TooManyRedirectsException;
use GuzzleHttp\Exception\TransferException;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Exception\ServerException;
use GuzzleHttp\Exception\ClientException;
use Psr\Http\Message\ServerRequestInterface;


class Http
{
    private $clientOptions;
    private $requestOptions;

    public function __construct()
    {
        $this->setDefaultOptions();

        if (LOG && LOG_CURL) $this->after('prepare_body', new GuzzleMiddlewareRequestCurl());
        $this->after('prepare_body', new GuzzleMiddlewareResponseHeaderCleaner());
        $this->after('prepare_body', new GuzzleMiddlewareTiming());
    }

    private function setDefaultOptions()
    {
        $this->setOption('verify', false);
        $this->setOption('headers', []);
        $this->setHandler(HandlerStack::create());
    }

    private function withHeadersNormalized(RequestInterface $request)
    {
        $req = clone $request;
        $headers = $req->getHeaders();

        foreach ($headers as $name => $value) {
            $req = $req->withoutHeader($name);
            $name = preg_replace('/^HTTP_/', '', $name);
            $name = preg_replace('/_/', '-', $name);
            $name = ucwords(strtolower($name), '-');
            $req = $req->withHeader($name, $value);
        }

        return $req;
    }

    // GESTIONE OPZIONI CLIENT GUZZLE
    // -----------------------------------------------------------------------------------------------------------------
    /**
     * @return Client Client
     */
    public function getClient()
    {
        return new Client($this->clientOptions);
    }

    /**
     * @return string
     */
    public function getBaseUri()
    {
        return $this->clientOptions['base_uri'];
    }

    /**
     * @param string $base_uri
     */
    public function setBaseUri($base_uri)
    {
        if (filter_var($base_uri, FILTER_VALIDATE_URL)) {
            $this->clientOptions['base_uri'] = $base_uri;
        }
    }

    /**
     * @return HandlerStack
     */
    public function getHandler()
    {
        return $this->clientOptions['handler'];
    }

    /**
     * @param HandlerStack $handler
     */
    public function setHandler($handler)
    {
        $this->clientOptions['handler'] = $handler;
    }

    /**
     * @param string $name
     * @param callable $middleware
     */
    public function before($name, $middleware)
    {
        $handler = $this->getHandler();
        $handler->before($name, $middleware);
    }

    /**
     * @param string $name
     * @param callable $middleware
     */
    public function after($name, $middleware)
    {
        $handler = $this->getHandler();
        $handler->after($name, $middleware);
    }

    // GESTIONE OPZIONI REQUEST GUZZLE
    // -----------------------------------------------------------------------------------------------------------------
    public function setOptions($options)
    {
        $this->requestOptions = $options;
    }


    public function getOptions()
    {
        return $this->requestOptions;
    }


    public function hasOption($key)
    {
        return isset($this->requestOptions[$key]);
    }


    public function getOption($key)
    {
        return $this->requestOptions[$key];
    }


    public function setOption($key, $value)
    {
        $this->requestOptions[$key] = $value;
    }

    // UTILITY
    // -----------------------------------------------------------------------------------------------------------------


    public function setAuth($username, $password)
    {
        $this->setOption('auth', [$username, $password]);
    }

    public function setProxy($proxy)
    {
        $this->setOption('proxy', $proxy);
    }

    public function allowRedirects($options)
    {
        $this->setOption('allow_redirects', $options);
    }

    // GESTIONE REQUEST - RESPONSE
    // -----------------------------------------------------------------------------------------------------------------
    /**
     * @param ServerRequestInterface $req - Request PSR-7
     * @return ResponseInterface - Response PSR-7
     */
    public function call($req)
    {

        // Gestiamo la possibilità di mockare le richieste
        if ($req->getAttribute('mockable', false)) {
            $req = $this->enableMock($req);
        }

        $client = $this->getClient();
        $req = $this->withHeadersNormalized($req);
        $options = $this->getOptions();

        try {
            $response = $client->send($req, $options);
        } catch (ClientException $exception) {
            $response = ($exception->hasResponse()) ?
                $exception->getResponse() :
                $this->getError(400, 'Client Exception');
        } catch (ServerException $exception) {
            $response = ($exception->hasResponse()) ?
                $exception->getResponse() :
                $this->getError(500, 'Server Exception');
        } catch (ConnectException $exception) {
            $response = $this->getError(500, 'Connection Exception');
        } catch (TooManyRedirectsException $exception) {
            $response = $this->getError(500, 'Too many redirects Exception');
        } catch (RequestException $exception) {
            $response = $this->getError(500, 'Request Exception');
        } catch (TransferException $exception) {
            $response = $this->getError(500, 'Transfer Exception');
        } catch (GuzzleException $exception) {
            $response = $this->getError(500, 'Guzzle Exception');
        } catch (Exception $exception) {
            $response = $this->getError(500, 'General Exception');
        }

        return $response;
    }

    /**
     * Genera una response PSR-7 di errore
     * @param int $status
     * @param string $reason
     * @return ResponseInterface $response
     */
    private function getError($status, $reason)
    {
        $response = new Response($status);
        $response->withStatus($status, $reason);
        return $response;
    }

    /**
     * Gestiamo la possibilità di mockare le richieste
     *
     * @param ServerRequestInterface $req
     * @return ServerRequestInterface
     */
    private function enableMock($req)
    {
        $uri = $req->getUri();
        $uri = $uri->withScheme(MOCKS_SCHEME);
        $uri = $uri->withHost(MOCKS_HOST);
        $uri = $uri->withPort(MOCKS_PORT);
        return $req->withUri($uri);
    }
}
