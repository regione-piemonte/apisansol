/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanesenpat.service;

import it.csi.apisan.apisanesenpat.middleware.InboundMiddleware;
import it.csi.apisan.apisanesenpat.middleware.MiddlewareInvocation;
import it.csi.apisan.apisanesenpat.middleware.OutboundMiddleware;
import it.csi.apisan.apisanesenpat.middleware.RestExecutorMiddleware;
import it.csi.apisan.apisanesenpat.util.Chain;
import it.csi.apisan.apisanesenpat.util.ChainBuilder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class CittadiniApiService extends RESTBaseService {

    protected String _shibIdentitaCodiceFiscale = null;
    protected String _xRequestId                = null;
    protected String _xForwardedFor             = null;
    protected String _xCodiceServizio           = null;
    protected String _citId                     = null;
    protected String _esenzioneId               = null;

    public CittadiniApiService(String shibIdentitaCodiceFiscale, String xRequestId, String xForwardedFor, String xCodiceServizio, String citId, String esenzioneId, SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        super(shibIdentitaCodiceFiscale, securityContext, httpHeaders, httpServletRequest, httpServletResponse);

        this._xRequestId                = xRequestId;
        this._xForwardedFor             = xForwardedFor;
        this._xCodiceServizio           = xCodiceServizio;
        this._citId                     = citId;
        this._esenzioneId               = esenzioneId;
    }


    @Override
    protected Response execute() {

        /* Validation */


        /* Creating the chain */
        ChainBuilder<MiddlewareInvocation> chainBuilder = ChainBuilder.chainBuilder();
        Chain<MiddlewareInvocation> chain = chainBuilder
                .first(request -> {
                    InboundMiddleware inboundMiddleware = new InboundMiddleware(request);
                    return inboundMiddleware.executeAndCheckNext();
                })
                .successor(request -> {
                    RestExecutorMiddleware restExecutorMiddleware = new RestExecutorMiddleware(request);
                    return restExecutorMiddleware.executeAndCheckNext();
                })
                .successor(request -> {
                    OutboundMiddleware outboundMiddleware = new OutboundMiddleware(request);
                    return outboundMiddleware.executeAndCheckNext();
                }).build();


        /* Prepare request for chain */
        MiddlewareInvocation middlewareInvocation = new MiddlewareInvocation();
        middlewareInvocation.setShibIdentitaCodiceFiscale(_shibIdentitaCodiceFiscale);
        middlewareInvocation.setxRequestId(_xRequestId);
        middlewareInvocation.setxForwardedFor(_xForwardedFor);
        middlewareInvocation.setxCodiceServizio(_xCodiceServizio);
        middlewareInvocation.setCitId(_citId);
        middlewareInvocation.setEsenzioneId(_esenzioneId);

        /* Excecute chain */
        chain.handle(middlewareInvocation);

        /* Manage results */
        Response.ResponseBuilder builder = Response.status(Response.Status.OK);
        middlewareInvocation.getHeaderResponse().entrySet().forEach(header -> {
            builder.header(header.getKey(), StringUtils.join(header.getValue(), " "));
        });
        builder.header("X-Request-ID", _xRequestId);
        Response result = builder.build();

        return result;
    }

}
