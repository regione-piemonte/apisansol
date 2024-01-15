/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanfse.integration.ScaricoStudiWSBean;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2022-02-18T11:54:40.831+01:00
 * Generated source version: 2.7.14
 * 
 */
@WebService(targetNamespace = "http://dmass.csi.it/", name = "ScaricoStudiWSBean")
@XmlSeeAlso({ObjectFactory.class})
@SOAPBinding(parameterStyle = SOAPBinding.ParameterStyle.BARE)
public interface ScaricoStudiWSBean {

    @WebMethod(operationName = "CancellaPacchetto")
    @WebResult(name = "CancellaPacchettoResponse", targetNamespace = "http://dmass.csi.it/", partName = "CancellaPacchettoResponse")
    public CancellaPacchettoResponse cancellaPacchetto(
        @WebParam(partName = "CancellaPacchettoRequest", name = "CancellaPacchettoRequest", targetNamespace = "http://dmass.csi.it/")
        CancellaPacchettoRequest cancellaPacchettoRequest
    );

    @WebMethod
    @WebResult(name = "VerificaStatoRichiesta2Response", targetNamespace = "http://dmass.csi.it/", partName = "VerificaStatoRichiesta2Response")
    public VerificaStatoRichiesta2Response verificaStatoRichiesta2(
        @WebParam(partName = "verificaStatoRichiesta2Request", name = "VerificaStatoRichiesta2Request", targetNamespace = "http://dmass.csi.it/")
        VerificaStatoRichiesta2Request verificaStatoRichiesta2Request
    );

    @WebMethod(operationName = "ScaricoStudi")
    @WebResult(name = "ScaricoStudiResponse", targetNamespace = "http://dmass.csi.it/", partName = "scaricoStudiResponse")
    public ScaricoStudiResponse scaricoStudi(
        @WebParam(partName = "scaricoStudiRequest", name = "ScaricoStudiRequest", targetNamespace = "http://dmass.csi.it/")
        ScaricoStudiRequest scaricoStudiRequest
    );

    @WebMethod
    @WebResult(name = "GetElencoPacchettiScadutiResponse", targetNamespace = "http://dmass.csi.it/", partName = "GetElencoPacchettiScadutiResponse")
    public GetElencoPacchettiScadutiResponse getElencoPacchettiScaduti(
        @WebParam(partName = "GetElencoPacchettiScadutiRequest", name = "GetElencoPacchettiScadutiRequest", targetNamespace = "http://dmass.csi.it/")
        GetElencoPacchettiScadutiRequest getElencoPacchettiScadutiRequest
    );

    @WebMethod
    @WebResult(name = "AggiornaStatoRichiestaResponse", targetNamespace = "http://dmass.csi.it/", partName = "AggiornaStatoRichiestaResponse")
    public AggiornaStatoRichiestaResponse aggiornaStatoRichiesta(
        @WebParam(partName = "aggiornaStatoRichiestaRequest", name = "AggiornaStatoRichiestaRequest", targetNamespace = "http://dmass.csi.it/")
        AggiornaStatoRichiestaRequest aggiornaStatoRichiestaRequest
    );

    @WebMethod
    @WebResult(name = "SetPacchettoCancellatoResponse", targetNamespace = "http://dmass.csi.it/", partName = "SetPacchettoCancellatoResponse")
    public SetPacchettoCancellatoResponse setPacchettoCancellato(
        @WebParam(partName = "SetPacchettoCancellatoRequest", name = "SetPacchettoCancellatoRequest", targetNamespace = "http://dmass.csi.it/")
        SetPacchettoCancellatoRequest setPacchettoCancellatoRequest
    );

    @WebMethod(operationName = "VerificaStatoListaRichieste")
    @WebResult(name = "VerificaStatoListaRichiesteResponse", targetNamespace = "http://dmass.csi.it/", partName = "VerificaStatoListaRichiesteResponse")
    public VerificaStatoListaRichiesteResponse verificaStatoListaRichieste(
        @WebParam(partName = "VerificaStatoListaRichiesteRequest", name = "VerificaStatoListaRichiesteRequest", targetNamespace = "http://dmass.csi.it/")
        VerificaStatoListaRichiesteRequest verificaStatoListaRichiesteRequest
    );

    @WebMethod
    @WebResult(name = "VerificaStatoRichiestaResponse", targetNamespace = "http://dmass.csi.it/", partName = "VerificaStatoRichiestaResponse")
    public VerificaStatoRichiestaResponse verificaStatoRichiesta(
        @WebParam(partName = "VerificaStatoRichiestaRequest", name = "VerificaStatoRichiestaRequest", targetNamespace = "http://dmass.csi.it/")
        VerificaStatoRichiestaRequest verificaStatoRichiestaRequest
    );
}
