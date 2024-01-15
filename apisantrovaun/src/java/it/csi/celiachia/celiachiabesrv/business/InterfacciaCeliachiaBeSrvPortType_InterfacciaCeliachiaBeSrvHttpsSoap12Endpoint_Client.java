/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.celiachia.celiachiabesrv.business;

/**
 * Please modify this class to meet your needs
 * This class is not complete
 */

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
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
 * 2021-01-12T14:38:32.874+01:00
 * Generated source version: 2.7.14
 * 
 */
public final class InterfacciaCeliachiaBeSrvPortType_InterfacciaCeliachiaBeSrvHttpsSoap12Endpoint_Client {

    private static final QName SERVICE_NAME = new QName("http://business.celiachiabesrv.celiachia.csi.it", "InterfacciaCeliachiaBeSrv");

    private InterfacciaCeliachiaBeSrvPortType_InterfacciaCeliachiaBeSrvHttpsSoap12Endpoint_Client() {
    }

    public static void main(String args[]) throws java.lang.Exception {
        URL wsdlURL = InterfacciaCeliachiaBeSrv.WSDL_LOCATION;
        if (args.length > 0 && args[0] != null && !"".equals(args[0])) { 
            File wsdlFile = new File(args[0]);
            try {
                if (wsdlFile.exists()) {
                    wsdlURL = wsdlFile.toURI().toURL();
                } else {
                    wsdlURL = new URL(args[0]);
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
      
        InterfacciaCeliachiaBeSrv ss = new InterfacciaCeliachiaBeSrv(wsdlURL, SERVICE_NAME);
        InterfacciaCeliachiaBeSrvPortType port = ss.getInterfacciaCeliachiaBeSrvHttpsSoap12Endpoint();  
        
        {
        System.out.println("Invoking rigeneraPinAssistito...");
        it.csi.celiachia.celiachiabesrv.input.xsd.RigeneraPinRequest _rigeneraPinAssistito_input = null;
        it.csi.celiachia.celiachiabesrv.output.xsd.RigeneraPinResponse _rigeneraPinAssistito__return = port.rigeneraPinAssistito(_rigeneraPinAssistito_input);
        System.out.println("rigeneraPinAssistito.result=" + _rigeneraPinAssistito__return);


        }
        {
        System.out.println("Invoking getPinAssistito...");
        it.csi.celiachia.celiachiabesrv.input.xsd.GetPinAssistito _getPinAssistito_input = null;
        it.csi.celiachia.celiachiabesrv.output.xsd.GetPinAssistitoResponse _getPinAssistito__return = port.getPinAssistito(_getPinAssistito_input);
        System.out.println("getPinAssistito.result=" + _getPinAssistito__return);


        }
        {
        System.out.println("Invoking verificaSaldoAssistito...");
        it.csi.celiachia.celiachiabesrv.input.xsd.VerificaSaldoAssistito _verificaSaldoAssistito_input = null;
        it.csi.celiachia.celiachiabesrv.output.xsd.VerificaSaldoAssistitoResponse _verificaSaldoAssistito__return = port.verificaSaldoAssistito(_verificaSaldoAssistito_input);
        System.out.println("verificaSaldoAssistito.result=" + _verificaSaldoAssistito__return);


        }
        {
        System.out.println("Invoking ricercaErogazioniAssistito...");
        it.csi.celiachia.celiachiabesrv.input.xsd.RicercaErogazioniAssistito _ricercaErogazioniAssistito_input = null;
        it.csi.celiachia.celiachiabesrv.output.xsd.RicercaErogazioniAssistitoResponse _ricercaErogazioniAssistito__return = port.ricercaErogazioniAssistito(_ricercaErogazioniAssistito_input);
        System.out.println("ricercaErogazioniAssistito.result=" + _ricercaErogazioniAssistito__return);


        }
        {
        System.out.println("Invoking usaPinDaQRCodeGOC...");
        it.csi.celiachia.celiachiabesrv.input.xsd.UsaPinDaQRCodeGOC _usaPinDaQRCodeGOC_input = null;
        it.csi.celiachia.celiachiabesrv.output.xsd.UsaPinDaQRCodeGOCResponse _usaPinDaQRCodeGOC__return = port.usaPinDaQRCodeGOC(_usaPinDaQRCodeGOC_input);
        System.out.println("usaPinDaQRCodeGOC.result=" + _usaPinDaQRCodeGOC__return);


        }
        {
        System.out.println("Invoking verificaErogazioniFarmacie...");
        it.csi.celiachia.celiachiabesrv.input.xsd.VerificaErogazioniFarmacie _verificaErogazioniFarmacie_input = null;
        it.csi.celiachia.celiachiabesrv.output.xsd.VerificaErogazioniFarmacieResponse _verificaErogazioniFarmacie__return = port.verificaErogazioniFarmacie(_verificaErogazioniFarmacie_input);
        System.out.println("verificaErogazioniFarmacie.result=" + _verificaErogazioniFarmacie__return);


        }
        {
        System.out.println("Invoking bckRigPinGOC...");
        it.csi.celiachia.celiachiabesrv.input.xsd.BCKRIGPinGOC _bckRigPinGOC_input = null;
        it.csi.celiachia.celiachiabesrv.output.xsd.BCKRIGPinGOCResponse _bckRigPinGOC__return = port.bckRigPinGOC(_bckRigPinGOC_input);
        System.out.println("bckRigPinGOC.result=" + _bckRigPinGOC__return);


        }

        System.exit(0);
    }

}
