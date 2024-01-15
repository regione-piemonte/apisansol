/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanfse.business.apisanfse.impl.base.service;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import it.csi.apisan.apisanfse.business.apisanfse.impl.base.FseDelegheRESTBaseService;
import it.csi.apisan.apisanfse.util.ConstantsFse;;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class CittadiniCitIdRefertiIdRefertoZipIdpacchettoGetService extends FseDelegheRESTBaseService {
	
	
	private String citId;
	private String idReferto;
	private String pin;
	private String idpacchetto;
	
	@Value("${scaricoStudiUrl}")
	private String scaricoStudiUrl;
	
	

	public CittadiniCitIdRefertiIdRefertoZipIdpacchettoGetService(String shibIdentitaCodiceFiscale, String xRequestID,
			String xCodiceServizio, String citId, String idReferto, String idpacchetto, String pin, SecurityContext securityContext,
			HttpHeaders httpHeaders) {
		super(shibIdentitaCodiceFiscale, xRequestID, xCodiceServizio, securityContext, httpHeaders);
		this.citId = citId;
		this.idReferto = idReferto;
		this.pin = pin;
		this.idpacchetto = idpacchetto;
	}



	@Override
	protected Response execute() {
		checkNotBlank(citId, "Codice fiscale non valorizzato");
		checkCodiceFiscaleValido(citId);
		checkUtenteAutorizzatoOrDelegato(citId);
		//12/11/2019 tolto obbligo di inserire il pin code per richiesta di Yvonne
		//checkNotBlank(pin, "Codice PIN non valorizzato");
		checkNotBlank(idReferto, "Identificativo del referto mancante");
		
		String url = String.format(scaricoStudiUrl+"?idPacchetto=%s&pin=%s", idpacchetto, ConstantsFse.PIN_CODE);
		log.info("execute", "Returning SEE_OTHER with scaricoStudi url:", url);
		
		
		return Response.status(Status.SEE_OTHER).header("Location", url).build();
	}

}
