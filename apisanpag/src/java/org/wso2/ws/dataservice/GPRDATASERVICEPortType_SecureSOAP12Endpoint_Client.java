/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package org.wso2.ws.dataservice;

/**
 * Please modify this class to meet your needs
 * This class is not complete
 */

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.jws.Oneway;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.ws.Action;
import javax.xml.ws.FaultAction;
import javax.xml.ws.RequestWrapper;
import javax.xml.ws.ResponseWrapper;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2020-05-14T08:42:59.416+02:00
 * Generated source version: 2.7.14
 * 
 */
public final class GPRDATASERVICEPortType_SecureSOAP12Endpoint_Client {

    private static final QName SERVICE_NAME = new QName("http://ws.wso2.org/dataservice", "GPR_DATASERVICE");

    private GPRDATASERVICEPortType_SecureSOAP12Endpoint_Client() {
    }

    public static void main(String args[]) throws java.lang.Exception {
        URL wsdlURL = GPRDATASERVICE.WSDL_LOCATION;
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
      
        GPRDATASERVICE ss = new GPRDATASERVICE(wsdlURL, SERVICE_NAME);
        GPRDATASERVICEPortType port = ss.getSecureSOAP12Endpoint();  
        
        {
        System.out.println("Invoking gprEstrazioneListaTicketMetadatiGPAupdate...");
        port.gprEstrazioneListaTicketMetadatiGPAupdate();


        }
        {
        System.out.println("Invoking gprEstrazioneListaTicketMetadatiGPAListaFatturaNested...");
        org.wso2.ws.dataservice.GprEstrazioneListaTicketMetadatiGPAListaFatturaNested _gprEstrazioneListaTicketMetadatiGPAListaFatturaNested_parameters = null;
        try {
            org.wso2.ws.dataservice.LISTAFATTURA _gprEstrazioneListaTicketMetadatiGPAListaFatturaNested__return = port.gprEstrazioneListaTicketMetadatiGPAListaFatturaNested(_gprEstrazioneListaTicketMetadatiGPAListaFatturaNested_parameters);
            System.out.println("gprEstrazioneListaTicketMetadatiGPAListaFatturaNested.result=" + _gprEstrazioneListaTicketMetadatiGPAListaFatturaNested__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprEndpointPerAttivazioneRecuperoMetadati...");
        java.lang.String _gprEndpointPerAttivazioneRecuperoMetadati_asrVal = "";
        javax.xml.ws.Holder<java.lang.String> _gprEndpointPerAttivazioneRecuperoMetadati_asr = new javax.xml.ws.Holder<java.lang.String>(_gprEndpointPerAttivazioneRecuperoMetadati_asrVal);
        try {
            port.gprEndpointPerAttivazioneRecuperoMetadati(_gprEndpointPerAttivazioneRecuperoMetadati_asr);

            System.out.println("gprEndpointPerAttivazioneRecuperoMetadati._gprEndpointPerAttivazioneRecuperoMetadati_asr=" + _gprEndpointPerAttivazioneRecuperoMetadati_asr.value);
        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking lmsGetRicevutePagamentiOnoratiByPratica...");
        java.math.BigDecimal _lmsGetRicevutePagamentiOnoratiByPratica_idPrenotazione = new java.math.BigDecimal("0");
        try {
            java.util.List<it.csi.RICEVUTAPAGAMENTO> _lmsGetRicevutePagamentiOnoratiByPratica__return = port.lmsGetRicevutePagamentiOnoratiByPratica(_lmsGetRicevutePagamentiOnoratiByPratica_idPrenotazione);
            System.out.println("lmsGetRicevutePagamentiOnoratiByPratica.result=" + _lmsGetRicevutePagamentiOnoratiByPratica__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprEstrazioneListaTicketMetadatiGPA...");
        org.wso2.ws.dataservice.GprEstrazioneListaTicketMetadatiGPA _gprEstrazioneListaTicketMetadatiGPA_parameters = null;
        try {
            org.wso2.ws.dataservice.EstrazioneListaTicketMetadatiResult _gprEstrazioneListaTicketMetadatiGPA__return = port.gprEstrazioneListaTicketMetadatiGPA(_gprEstrazioneListaTicketMetadatiGPA_parameters);
            System.out.println("gprEstrazioneListaTicketMetadatiGPA.result=" + _gprEstrazioneListaTicketMetadatiGPA__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprEndpointPerGetListaFlussiFRDaInviareGPA...");
        try {
            java.util.List<org.wso2.ws.dataservice.FLUSSO> _gprEndpointPerGetListaFlussiFRDaInviareGPA__return = port.gprEndpointPerGetListaFlussiFRDaInviareGPA();
            System.out.println("gprEndpointPerGetListaFlussiFRDaInviareGPA.result=" + _gprEndpointPerGetListaFlussiFRDaInviareGPA__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprEndpointPerGetDatiSensibiliUtenteCentrale...");
        java.lang.String _gprEndpointPerGetDatiSensibiliUtenteCentrale_asrVal = "";
        javax.xml.ws.Holder<java.lang.String> _gprEndpointPerGetDatiSensibiliUtenteCentrale_asr = new javax.xml.ws.Holder<java.lang.String>(_gprEndpointPerGetDatiSensibiliUtenteCentrale_asrVal);
        try {
            port.gprEndpointPerGetDatiSensibiliUtenteCentrale(_gprEndpointPerGetDatiSensibiliUtenteCentrale_asr);

            System.out.println("gprEndpointPerGetDatiSensibiliUtenteCentrale._gprEndpointPerGetDatiSensibiliUtenteCentrale_asr=" + _gprEndpointPerGetDatiSensibiliUtenteCentrale_asr.value);
        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprGetConfigLottoIUV...");
        org.wso2.ws.dataservice.GprGetConfigLottoIUV _gprGetConfigLottoIUV_parameters = null;
        try {
            org.wso2.ws.dataservice.Risposta _gprGetConfigLottoIUV__return = port.gprGetConfigLottoIUV(_gprGetConfigLottoIUV_parameters);
            System.out.println("gprGetConfigLottoIUV.result=" + _gprGetConfigLottoIUV__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking lmsGetTicketPagatiFunc...");
        java.lang.String _lmsGetTicketPagatiFunc_codiceFiscale = "";
        java.lang.String _lmsGetTicketPagatiFunc_codiceFiscaleDelgante = "";
        java.lang.String _lmsGetTicketPagatiFunc_annoPagamento = "";
        try {
            java.util.List<it.csi.PRATICA> _lmsGetTicketPagatiFunc__return = port.lmsGetTicketPagatiFunc(_lmsGetTicketPagatiFunc_codiceFiscale, _lmsGetTicketPagatiFunc_codiceFiscaleDelgante, _lmsGetTicketPagatiFunc_annoPagamento);
            System.out.println("lmsGetTicketPagatiFunc.result=" + _lmsGetTicketPagatiFunc__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprListaAvvisiUNP...");
        java.lang.String _gprListaAvvisiUNP_cryptPwdVal = "";
        javax.xml.ws.Holder<java.lang.String> _gprListaAvvisiUNP_cryptPwd = new javax.xml.ws.Holder<java.lang.String>(_gprListaAvvisiUNP_cryptPwdVal);
        try {
            port.gprListaAvvisiUNP(_gprListaAvvisiUNP_cryptPwd);

            System.out.println("gprListaAvvisiUNP._gprListaAvvisiUNP_cryptPwd=" + _gprListaAvvisiUNP_cryptPwd.value);
        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprListaDescrizioneStrutturaByNRE...");
        java.util.List<java.lang.String> _gprListaDescrizioneStrutturaByNRE_nre = null;
        try {
            java.util.List<org.wso2.ws.dataservice.NREDESCRIZIONE> _gprListaDescrizioneStrutturaByNRE__return = port.gprListaDescrizioneStrutturaByNRE(_gprListaDescrizioneStrutturaByNRE_nre);
            System.out.println("gprListaDescrizioneStrutturaByNRE.result=" + _gprListaDescrizioneStrutturaByNRE__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprRecuperoListaTicketMetadatiUpdate...");
        java.lang.String _gprRecuperoListaTicketMetadatiUpdate_dal = "";
        java.lang.String _gprRecuperoListaTicketMetadatiUpdate_al = "";
        port.gprRecuperoListaTicketMetadatiUpdate(_gprRecuperoListaTicketMetadatiUpdate_dal, _gprRecuperoListaTicketMetadatiUpdate_al);


        }
        {
        System.out.println("Invoking gprGetConfigLottoIUVCodiceAsrCodiceVersamento...");
        org.wso2.ws.dataservice.GprGetConfigLottoIUVCodiceAsrCodiceVersamento _gprGetConfigLottoIUVCodiceAsrCodiceVersamento_parameters = null;
        try {
            org.wso2.ws.dataservice.Risposta _gprGetConfigLottoIUVCodiceAsrCodiceVersamento__return = port.gprGetConfigLottoIUVCodiceAsrCodiceVersamento(_gprGetConfigLottoIUVCodiceAsrCodiceVersamento_parameters);
            System.out.println("gprGetConfigLottoIUVCodiceAsrCodiceVersamento.result=" + _gprGetConfigLottoIUVCodiceAsrCodiceVersamento__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprListaRELByCF...");
        java.lang.String _gprListaRELByCF_codiceFiscaleVal = "";
        javax.xml.ws.Holder<java.lang.String> _gprListaRELByCF_codiceFiscale = new javax.xml.ws.Holder<java.lang.String>(_gprListaRELByCF_codiceFiscaleVal);
        try {
            port.gprListaRELByCF(_gprListaRELByCF_codiceFiscale);

            System.out.println("gprListaRELByCF._gprListaRELByCF_codiceFiscale=" + _gprListaRELByCF_codiceFiscale.value);
        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprInsertLogMessage...");
        java.lang.String _gprInsertLogMessage_idAsr = "";
        java.lang.String _gprInsertLogMessage_uuid = "";
        java.math.BigDecimal _gprInsertLogMessage_codStato = new java.math.BigDecimal("0");
        java.lang.String _gprInsertLogMessage_stringaXml = "";
        java.lang.String _gprInsertLogMessage_codServizio = "";
        java.lang.String _gprInsertLogMessage_azione = "";
        java.lang.String _gprInsertLogMessage_numeroSportello = "";
        java.lang.String _gprInsertLogMessage_numeroPratica = "";
        java.lang.String _gprInsertLogMessage_codiceFiscale = "";
        java.lang.String _gprInsertLogMessage_uuidPtb = "";
        port.gprInsertLogMessage(_gprInsertLogMessage_idAsr, _gprInsertLogMessage_uuid, _gprInsertLogMessage_codStato, _gprInsertLogMessage_stringaXml, _gprInsertLogMessage_codServizio, _gprInsertLogMessage_azione, _gprInsertLogMessage_numeroSportello, _gprInsertLogMessage_numeroPratica, _gprInsertLogMessage_codiceFiscale, _gprInsertLogMessage_uuidPtb);


        }
        {
        System.out.println("Invoking gprEndpointPerAttivazioneAcquisizioneListaStatoTicket...");
        java.lang.String _gprEndpointPerAttivazioneAcquisizioneListaStatoTicket_asrVal = "";
        javax.xml.ws.Holder<java.lang.String> _gprEndpointPerAttivazioneAcquisizioneListaStatoTicket_asr = new javax.xml.ws.Holder<java.lang.String>(_gprEndpointPerAttivazioneAcquisizioneListaStatoTicket_asrVal);
        try {
            port.gprEndpointPerAttivazioneAcquisizioneListaStatoTicket(_gprEndpointPerAttivazioneAcquisizioneListaStatoTicket_asr);

            System.out.println("gprEndpointPerAttivazioneAcquisizioneListaStatoTicket._gprEndpointPerAttivazioneAcquisizioneListaStatoTicket_asr=" + _gprEndpointPerAttivazioneAcquisizioneListaStatoTicket_asr.value);
        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprEndpointPerEstrazioneTicketMetadatiGPR...");
        try {
            port.gprEndpointPerEstrazioneTicketMetadatiGPR();

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprGetConfigLottoIUVCodiceAsr...");
        org.wso2.ws.dataservice.GprGetConfigLottoIUVCodiceAsr _gprGetConfigLottoIUVCodiceAsr_parameters = null;
        try {
            org.wso2.ws.dataservice.Risposta _gprGetConfigLottoIUVCodiceAsr__return = port.gprGetConfigLottoIUVCodiceAsr(_gprGetConfigLottoIUVCodiceAsr_parameters);
            System.out.println("gprGetConfigLottoIUVCodiceAsr.result=" + _gprGetConfigLottoIUVCodiceAsr__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking lmsGetRimborsiPagamentoByPratica...");
        java.math.BigDecimal _lmsGetRimborsiPagamentoByPratica_idPrenotazione = new java.math.BigDecimal("0");
        try {
            java.util.List<it.csi.RIMBORSOPAGAMENTO> _lmsGetRimborsiPagamentoByPratica__return = port.lmsGetRimborsiPagamentoByPratica(_lmsGetRimborsiPagamentoByPratica_idPrenotazione);
            System.out.println("lmsGetRimborsiPagamentoByPratica.result=" + _lmsGetRimborsiPagamentoByPratica__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprEstrazioneListaTicketMetadatiGPANested...");
        org.wso2.ws.dataservice.GprEstrazioneListaTicketMetadatiGPANested _gprEstrazioneListaTicketMetadatiGPANested_parameters = null;
        try {
            org.wso2.ws.dataservice.ELENCOPRESTAZIONI _gprEstrazioneListaTicketMetadatiGPANested__return = port.gprEstrazioneListaTicketMetadatiGPANested(_gprEstrazioneListaTicketMetadatiGPANested_parameters);
            System.out.println("gprEstrazioneListaTicketMetadatiGPANested.result=" + _gprEstrazioneListaTicketMetadatiGPANested__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprGetDatiSensibiliUtenteAziendale...");
        org.wso2.ws.dataservice.GprGetDatiSensibiliUtenteAziendale _gprGetDatiSensibiliUtenteAziendale_parameters = null;
        try {
            org.wso2.ws.dataservice.GetDatiSensibiliUtenteAziendaleResult _gprGetDatiSensibiliUtenteAziendale__return = port.gprGetDatiSensibiliUtenteAziendale(_gprGetDatiSensibiliUtenteAziendale_parameters);
            System.out.println("gprGetDatiSensibiliUtenteAziendale.result=" + _gprGetDatiSensibiliUtenteAziendale__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprRecuperoListaTicketMetadati...");
        org.wso2.ws.dataservice.GprRecuperoListaTicketMetadati _gprRecuperoListaTicketMetadati_parameters = null;
        try {
            org.wso2.ws.dataservice.RecuperoListaTicketMetadatiResult _gprRecuperoListaTicketMetadati__return = port.gprRecuperoListaTicketMetadati(_gprRecuperoListaTicketMetadati_parameters);
            System.out.println("gprRecuperoListaTicketMetadati.result=" + _gprRecuperoListaTicketMetadati__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprEndpointPerGetListaTicketCF...");
        java.lang.String _gprEndpointPerGetListaTicketCF_asrVal = "";
        javax.xml.ws.Holder<java.lang.String> _gprEndpointPerGetListaTicketCF_asr = new javax.xml.ws.Holder<java.lang.String>(_gprEndpointPerGetListaTicketCF_asrVal);
        try {
            port.gprEndpointPerGetListaTicketCF(_gprEndpointPerGetListaTicketCF_asr);

            System.out.println("gprEndpointPerGetListaTicketCF._gprEndpointPerGetListaTicketCF_asr=" + _gprEndpointPerGetListaTicketCF_asr.value);
        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }
        {
        System.out.println("Invoking gprRichiestaLottoIUVMulti...");
        java.lang.String _gprRichiestaLottoIUVMulti_codiceAsr = "";
        java.lang.String _gprRichiestaLottoIUVMulti_codiceVersamento = "";
        java.lang.String _gprRichiestaLottoIUVMulti_uuidGpr = "";
        java.lang.String _gprRichiestaLottoIUVMulti_uuidGpa = "";
        java.math.BigDecimal _gprRichiestaLottoIUVMulti_iuvRichiesti = new java.math.BigDecimal("0");
        java.math.BigDecimal _gprRichiestaLottoIUVMulti_esitoPrec = new java.math.BigDecimal("0");
        try {
            java.util.List<org.wso2.ws.dataservice.LOTTOIUV> _gprRichiestaLottoIUVMulti__return = port.gprRichiestaLottoIUVMulti(_gprRichiestaLottoIUVMulti_codiceAsr, _gprRichiestaLottoIUVMulti_codiceVersamento, _gprRichiestaLottoIUVMulti_uuidGpr, _gprRichiestaLottoIUVMulti_uuidGpa, _gprRichiestaLottoIUVMulti_iuvRichiesti, _gprRichiestaLottoIUVMulti_esitoPrec);
            System.out.println("gprRichiestaLottoIUVMulti.result=" + _gprRichiestaLottoIUVMulti__return);

        } catch (DataServiceFault e) { 
            System.out.println("Expected exception: DataServiceFault has occurred.");
            System.out.println(e.toString());
        }
            }

        System.exit(0);
    }

}
