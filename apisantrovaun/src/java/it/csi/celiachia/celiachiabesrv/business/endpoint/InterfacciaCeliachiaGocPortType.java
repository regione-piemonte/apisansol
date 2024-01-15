/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.celiachia.celiachiabesrv.business.endpoint;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.ws.Action;
import javax.xml.ws.RequestWrapper;
import javax.xml.ws.ResponseWrapper;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2020-12-22T17:10:31.223+01:00
 * Generated source version: 2.7.14
 * 
 */
@WebService(targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", name = "InterfacciaCeliachiaGocPortType")
@XmlSeeAlso({it.csi.celiachia.celiachiabesrv.input.xsd.ObjectFactory.class, ObjectFactory.class, it.csi.celiachia.celiachiabesrv.output.xsd.ObjectFactory.class})
public interface InterfacciaCeliachiaGocPortType {

    @WebMethod(action = "urn:verificaErogazioniFarmacie")
    @Action(input = "urn:verificaErogazioniFarmacie", output = "urn:verificaErogazioniFarmacieResponse")
    @RequestWrapper(localName = "verificaErogazioniFarmacie", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.VerificaErogazioniFarmacie")
    @ResponseWrapper(localName = "verificaErogazioniFarmacieResponse", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.VerificaErogazioniFarmacieResponse")
    @WebResult(name = "return", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.VerificaErogazioniFarmacieResponse verificaErogazioniFarmacie(
        @WebParam(name = "input", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.VerificaErogazioniFarmacie input
    );

    @WebMethod(action = "urn:usaPinDaQRCodeGOC")
    @Action(input = "urn:usaPinDaQRCodeGOC", output = "urn:usaPinDaQRCodeGOCResponse")
    @RequestWrapper(localName = "usaPinDaQRCodeGOC", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.UsaPinDaQRCodeGOC")
    @ResponseWrapper(localName = "usaPinDaQRCodeGOCResponse", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.UsaPinDaQRCodeGOCResponse")
    @WebResult(name = "return", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.UsaPinResponse usaPinDaQRCodeGOC(
        @WebParam(name = "usaPinInput", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.UsaPinRequest usaPinInput
    );

    @WebMethod(action = "urn:ricercaErogazioniAssistito")
    @Action(input = "urn:ricercaErogazioniAssistito", output = "urn:ricercaErogazioniAssistitoResponse")
    @RequestWrapper(localName = "ricercaErogazioniAssistito", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.RicercaErogazioniAssistito")
    @ResponseWrapper(localName = "ricercaErogazioniAssistitoResponse", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.RicercaErogazioniAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.ElencoErogResponse ricercaErogazioniAssistito(
        @WebParam(name = "elencoErogInput", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.ElencoErogRequest elencoErogInput
    );

    @WebMethod(operationName = "BCKRIGPinGOC", action = "urn:BCKRIGPinGOC")
    @Action(input = "urn:BCKRIGPinGOC", output = "urn:BCKRIGPinGOCResponse")
    @RequestWrapper(localName = "BCKRIGPinGOC", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.BCKRIGPinGOC")
    @ResponseWrapper(localName = "BCKRIGPinGOCResponse", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.BCKRIGPinGOCResponse")
    @WebResult(name = "return", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.RigeneraPinResponse bckrigPinGOC(
        @WebParam(name = "saldoBuonoInput", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.RigeneraPinRequest saldoBuonoInput
    );

    @WebMethod(action = "urn:verificaSaldoAssistito")
    @Action(input = "urn:verificaSaldoAssistito", output = "urn:verificaSaldoAssistitoResponse")
    @RequestWrapper(localName = "verificaSaldoAssistito", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.VerificaSaldoAssistito")
    @ResponseWrapper(localName = "verificaSaldoAssistitoResponse", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.VerificaSaldoAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.SaldoBuonoResponse verificaSaldoAssistito(
        @WebParam(name = "saldoBuonoInput", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.SaldoBuonoRequest saldoBuonoInput
    );

    @WebMethod(action = "urn:getPinAssistito")
    @Action(input = "urn:getPinAssistito", output = "urn:getPinAssistitoResponse")
    @RequestWrapper(localName = "getPinAssistito", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.GetPinAssistito")
    @ResponseWrapper(localName = "getPinAssistitoResponse", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.GetPinAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.PinGocResponse getPinAssistito(
        @WebParam(name = "pinGocInput", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.PinGocRequest pinGocInput
    );

    @WebMethod(action = "urn:rigeneraPinAssistito")
    @Action(input = "urn:rigeneraPinAssistito", output = "urn:rigeneraPinAssistitoResponse")
    @RequestWrapper(localName = "rigeneraPinAssistito", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.RigeneraPinAssistito")
    @ResponseWrapper(localName = "rigeneraPinAssistitoResponse", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.endpoint.RigeneraPinAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.RigeneraPinResponse rigeneraPinAssistito(
        @WebParam(name = "rigeneraPinInput", targetNamespace = "http://endpoint.business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.RigeneraPinRequest rigeneraPinInput
    );
}