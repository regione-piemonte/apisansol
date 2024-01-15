/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.dma.dmaclbluc;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * This class was generated by Apache CXF 2.7.14
 * 2021-04-22T16:01:59.379+02:00
 * Generated source version: 2.7.14
 * 
 */
@WebService(targetNamespace = "http://dmaclbluc.dma.csi.it/", name = "TaccuinoService")
@XmlSeeAlso({ObjectFactory.class, it.csi.dma.ObjectFactory.class})
@SOAPBinding(parameterStyle = SOAPBinding.ParameterStyle.BARE)
public interface TaccuinoService {

    @WebMethod
    @WebResult(name = "setDoloreResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setDoloreResponse")
    public SetDoloreResponse setDolore(
        @WebParam(partName = "setDolore", name = "setDolore", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetDoloreRequest setDolore
    );

    @WebMethod
    @WebResult(name = "setNotaGeneraleResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setNotaGeneraleResponse")
    public SetNotaGeneraleResponse setNotaGenerale(
        @WebParam(partName = "setNotaGenerale", name = "setNotaGenerale", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetNotaGeneraleRequest setNotaGenerale
    );

    @WebMethod
    @WebResult(name = "getRilevazioniResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getRilevazioniResponse")
    public GetRilevazioniResponse getRilevazioni(
        @WebParam(partName = "getRilevazioni", name = "getRilevazioni", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetRilevazioniRequest getRilevazioni
    );

    @WebMethod
    @WebResult(name = "setDietaResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setDietaResponse")
    public SetDietaResponse setDieta(
        @WebParam(partName = "setDieta", name = "setDieta", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetDietaRequest setDieta
    );

    @WebMethod
    @WebResult(name = "getDoloriResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getDoloriResponse")
    public GetDoloriResponse getDolori(
        @WebParam(partName = "getDolori", name = "getDolori", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetDoloriRequest getDolori
    );

    @WebMethod
    @WebResult(name = "setImpostazioniTaccuinoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setImpostazioniTaccuinoResponse")
    public SetImpostazioniTaccuinoResponse setImpostazioniTaccuino(
        @WebParam(partName = "setImpostazioniTaccuino", name = "setImpostazioniTaccuino", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetImpostazioniTaccuinoRequest setImpostazioniTaccuino
    );

    @WebMethod
    @WebResult(name = "setFarmacoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setFarmacoResponse")
    public SetFarmacoResponse setFarmaco(
        @WebParam(partName = "setFarmaco", name = "setFarmaco", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetFarmacoRequest setFarmaco
    );

    @WebMethod
    @WebResult(name = "setSintomoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setSintomoResponse")
    public SetSintomoResponse setSintomo(
        @WebParam(partName = "setSintomo", name = "setSintomo", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetSintomoRequest setSintomo
    );

    @WebMethod
    @WebResult(name = "cancellaContattiStruttureResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "cancellaContattiStruttureResponse")
    public CancellaContattiStruttureResponse cancellaContattiStrutture(
        @WebParam(partName = "cancellaContattiStrutture", name = "cancellaContattiStrutture", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        CancellaContattiStruttureRequest cancellaContattiStrutture
    );

    @WebMethod
    @WebResult(name = "setRilevazioniResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setRilevazioniResponse")
    public SetRilevazioniResponse setRilevazioni(
        @WebParam(partName = "setRilevazioni", name = "setRilevazioni", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetRilevazioniRequest setRilevazioni
    );

    @WebMethod
    @WebResult(name = "getDieteResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getDieteResponse")
    public GetDieteResponse getDiete(
        @WebParam(partName = "getDiete", name = "getDiete", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetDieteRequest getDiete
    );

    @WebMethod
    @WebResult(name = "setOscuramentoTaccuinoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setOscuramentoTaccuinoResponse")
    public SetOscuramentoTaccuinoResponse setOscuramentoTaccuino(
        @WebParam(partName = "setOscuramentoTaccuino", name = "setOscuramentoTaccuino", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetOscuramentoTaccuinoRequest setOscuramentoTaccuino
    );

    @WebMethod
    @WebResult(name = "getDecodificaStrutturaTipoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getDecodificaStrutturaTipoResponse")
    public GetDecodificaStrutturaTipoResponse getDecodificaStrutturaTipo(
        @WebParam(partName = "getDecodificaStrutturaTipo", name = "getDecodificaStrutturaTipo", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetDecodificaStrutturaTipoRequest getDecodificaStrutturaTipo
    );

    @WebMethod
    @WebResult(name = "cancellaSintomiResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "cancellaSintomiResponse")
    public CancellaSintomiResponse cancellaSintomi(
        @WebParam(partName = "cancellaSintomi", name = "cancellaSintomi", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        CancellaSintomiRequest cancellaSintomi
    );

    @WebMethod
    @WebResult(name = "getTaccuinoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getTaccuinoResponse")
    public GetTaccuinoResponse getTaccuino(
        @WebParam(partName = "getTaccuino", name = "getTaccuino", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetTaccuinoRequest getTaccuino
    );

    @WebMethod
    @WebResult(name = "setContattoStrutturaResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setContattoStrutturaResponse")
    public SetContattoStrutturaResponse setContattoStruttura(
        @WebParam(partName = "setContattoStruttura", name = "setContattoStruttura", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetContattoStrutturaRequest setContattoStruttura
    );

    @WebMethod
    @WebResult(name = "getDecodificaModalitaRilevazioneResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getDecodificaModalitaRilevazioneResponse")
    public GetDecodificheModalitaRilevazioneResponse getDecodificaModalitaRilevazione(
        @WebParam(partName = "getDecodificaModalitaRilevazione", name = "getDecodificaModalitaRilevazione", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetDecodificaModalitaRilevazioneRequest getDecodificaModalitaRilevazione
    );

    @WebMethod
    @WebResult(name = "cancellaRilevazioniResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "cancellaRilevazioniResponse")
    public CancellaRilevazioniResponse cancellaRilevazioni(
        @WebParam(partName = "cancellaRilevazioni", name = "cancellaRilevazioni", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        CancellaRilevazioniRequest cancellaRilevazioni
    );

    @WebMethod
    @WebResult(name = "getContattiStruttureResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getContattiStruttureResponse")
    public GetContattiStruttureResponse getContattiStrutture(
        @WebParam(partName = "getContattiStrutture", name = "getContattiStrutture", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetContattiStruttureRequest getContattiStrutture
    );

    @WebMethod
    @WebResult(name = "getEventiResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getEventiResponse")
    public GetEventiResponse getEventi(
        @WebParam(partName = "getEventi", name = "getEventi", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetEventiRequest getEventi
    );

    @WebMethod
    @WebResult(name = "cancellaEventoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "cancellaEventoResponse")
    public CancellaEventoResponse cancellaEvento(
        @WebParam(partName = "cancellaEvento", name = "cancellaEvento", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        CancellaEventoRequest cancellaEvento
    );

    @WebMethod
    @WebResult(name = "cancellaFarmacoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "cancellaFarmacoResponse")
    public CancellaFarmacoResponse cancellaFarmaco(
        @WebParam(partName = "cancellaFarmaco", name = "cancellaFarmaco", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        CancellaFarmacoRequest cancellaFarmaco
    );

    @WebMethod
    @WebResult(name = "getFarmaciResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getFarmaciResponse")
    public GetFarmaciResponse getFarmaci(
        @WebParam(partName = "getFarmaci", name = "getFarmaci", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetFarmaciRequest getFarmaci
    );

    @WebMethod
    @WebResult(name = "getSintomiResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getSintomiResponse")
    public GetSintomiResponse getSintomi(
        @WebParam(partName = "getSintomi", name = "getSintomi", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetSintomiRequest getSintomi
    );

    @WebMethod
    @WebResult(name = "getDecodificaIntensitaDoloreResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getDecodificaIntensitaDoloreResponse")
    public GetDecodificaIntensitaDoloreResponse getDecodificaIntensitaDolore(
        @WebParam(partName = "getDecodificaIntensitaDolore", name = "getDecodificaIntensitaDolore", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetDecodificaIntensitaDoloreRequest getDecodificaIntensitaDolore
    );

    @WebMethod
    @WebResult(name = "cancellaDoloriResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "cancellaDoloriResponse")
    public CancellaDoloriResponse cancellaDolori(
        @WebParam(partName = "cancellaDolori", name = "cancellaDolori", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        CancellaDoloriRequest cancellaDolori
    );

    @WebMethod
    @WebResult(name = "getDescrittoriMisurazioneResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getDescrittoriMisurazioneResponse")
    public GetDescrittoriMisurazioneResponse getDescrittoriMisurazione(
        @WebParam(partName = "getDescrittoriMisurazione", name = "getDescrittoriMisurazione", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetDescrittoriMisurazioneRequest getDescrittoriMisurazione
    );

    @WebMethod
    @WebResult(name = "getLogResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getLogResponse")
    public DmaclLXmlMessaggiDtoArray getLog(
        @WebParam(partName = "getLog", name = "getLog", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        DmaclLXmlMessaggiDto getLog
    ) throws DmaclLXmlMessaggiDaoException_Exception;

    @WebMethod
    @WebResult(name = "getDecodificaContattoTipoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "getDecodificaContattoTipoResponse")
    public GetDecodificaContattoTipoResponse getDecodificaContattoTipo(
        @WebParam(partName = "getDecodificaContattoTipo", name = "getDecodificaContattoTipo", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        GetDecodificaContattoTipoRequest getDecodificaContattoTipo
    );

    @WebMethod
    @WebResult(name = "setEventoResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "setEventoResponse")
    public SetEventoResponse setEvento(
        @WebParam(partName = "setEvento", name = "setEvento", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        SetEventoRequest setEvento
    );

    @WebMethod
    @WebResult(name = "cancellaDietaResponse", targetNamespace = "http://dmaclbluc.dma.csi.it/", partName = "cancellaDietaResponse")
    public CancellaDietaResponse cancellaDieta(
        @WebParam(partName = "cancellaDieta", name = "cancellaDieta", targetNamespace = "http://dmaclbluc.dma.csi.it/")
        CancellaDietaRequest cancellaDieta
    );
}
