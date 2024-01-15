/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.celiachia.celiachiabesrv.business;

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
 * 2021-01-12T14:38:32.894+01:00
 * Generated source version: 2.7.14
 * 
 */
@WebService(targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", name = "InterfacciaCeliachiaBeSrvPortType")
@XmlSeeAlso({it.csi.celiachia.celiachiabesrv.input.xsd.ObjectFactory.class, ObjectFactory.class, it.csi.celiachia.celiachiabesrv.output.xsd.ObjectFactory.class})
public interface InterfacciaCeliachiaBeSrvPortType {

    @WebMethod(action = "urn:rigeneraPinAssistito")
    @Action(input = "urn:rigeneraPinAssistito", output = "urn:rigeneraPinAssistitoResponse")
    @RequestWrapper(localName = "rigeneraPinAssistito", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.RigeneraPinAssistito")
    @ResponseWrapper(localName = "rigeneraPinAssistitoResponse", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.RigeneraPinAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.RigeneraPinResponse rigeneraPinAssistito(
        @WebParam(name = "input", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.RigeneraPinRequest input
    );

    @WebMethod(action = "urn:getPinAssistito")
    @Action(input = "urn:getPinAssistito", output = "urn:getPinAssistitoResponse")
    @RequestWrapper(localName = "getPinAssistito", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.GetPinAssistito")
    @ResponseWrapper(localName = "getPinAssistitoResponse", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.GetPinAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.GetPinAssistitoResponse getPinAssistito(
        @WebParam(name = "input", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.GetPinAssistito input
    );

    @WebMethod(action = "urn:verificaSaldoAssistito")
    @Action(input = "urn:verificaSaldoAssistito", output = "urn:verificaSaldoAssistitoResponse")
    @RequestWrapper(localName = "verificaSaldoAssistito", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.VerificaSaldoAssistito")
    @ResponseWrapper(localName = "verificaSaldoAssistitoResponse", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.VerificaSaldoAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.VerificaSaldoAssistitoResponse verificaSaldoAssistito(
        @WebParam(name = "input", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.VerificaSaldoAssistito input
    );

    @WebMethod(action = "urn:ricercaErogazioniAssistito")
    @Action(input = "urn:ricercaErogazioniAssistito", output = "urn:ricercaErogazioniAssistitoResponse")
    @RequestWrapper(localName = "ricercaErogazioniAssistito", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.RicercaErogazioniAssistito")
    @ResponseWrapper(localName = "ricercaErogazioniAssistitoResponse", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.RicercaErogazioniAssistitoResponse")
    @WebResult(name = "return", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.RicercaErogazioniAssistitoResponse ricercaErogazioniAssistito(
        @WebParam(name = "input", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.RicercaErogazioniAssistito input
    );

    @WebMethod(action = "urn:usaPinDaQRCodeGOC")
    @Action(input = "urn:usaPinDaQRCodeGOC", output = "urn:usaPinDaQRCodeGOCResponse")
    @RequestWrapper(localName = "usaPinDaQRCodeGOC", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.UsaPinDaQRCodeGOC")
    @ResponseWrapper(localName = "usaPinDaQRCodeGOCResponse", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.UsaPinDaQRCodeGOCResponse")
    @WebResult(name = "return", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.UsaPinDaQRCodeGOCResponse usaPinDaQRCodeGOC(
        @WebParam(name = "input", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.UsaPinDaQRCodeGOC input
    );

    @WebMethod(action = "urn:verificaErogazioniFarmacie")
    @Action(input = "urn:verificaErogazioniFarmacie", output = "urn:verificaErogazioniFarmacieResponse")
    @RequestWrapper(localName = "verificaErogazioniFarmacie", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.VerificaErogazioniFarmacie")
    @ResponseWrapper(localName = "verificaErogazioniFarmacieResponse", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.VerificaErogazioniFarmacieResponse")
    @WebResult(name = "return", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.VerificaErogazioniFarmacieResponse verificaErogazioniFarmacie(
        @WebParam(name = "input", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.VerificaErogazioniFarmacie input
    );

    @WebMethod(action = "urn:bckRigPinGOC")
    @Action(input = "urn:bckRigPinGOC", output = "urn:bckRigPinGOCResponse")
    @RequestWrapper(localName = "bckRigPinGOC", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.BckRigPinGOC")
    @ResponseWrapper(localName = "bckRigPinGOCResponse", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it", className = "it.csi.celiachia.celiachiabesrv.business.BckRigPinGOCResponse")
    @WebResult(name = "return", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
    public it.csi.celiachia.celiachiabesrv.output.xsd.BCKRIGPinGOCResponse bckRigPinGOC(
        @WebParam(name = "input", targetNamespace = "http://business.celiachiabesrv.celiachia.csi.it")
        it.csi.celiachia.celiachiabesrv.input.xsd.BCKRIGPinGOC input
    );
}
