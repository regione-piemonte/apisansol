/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanvac.service;

import static it.csi.apisan.apisanvac.util.JsonNodeUtils.asText;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import it.csi.apisan.apisanvac.common.DelegheRESTBaseService;
import it.csi.apisan.apisanvac.model.ModelIstanza;
import it.csi.apisan.apisanvac.model.ModelVaccino;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class CittadiniCitIdVaccinazioniIstanzePrenotazioneIdIstanzaGetService extends DelegheRESTBaseService {

	@Autowired
	private VacApiRestInvoker vacApiRestInvoker;

	private String citId;
	private String idIstanza;

	public CittadiniCitIdVaccinazioniIstanzePrenotazioneIdIstanzaGetService(String shibIdentitaCodiceFiscale,
			String xRequestId, String xForwardedFor, String xCodiceServizio, String citId, String idIstanza,
			SecurityContext securityContext, HttpHeaders httpHeaders, HttpServletRequest request,
			HttpServletResponse response) {
		super(xRequestId, securityContext, httpHeaders, request, response);
		this.citId = citId;
		this.idIstanza = idIstanza;
	}

	@Override
	protected Response execute() {

		checkNotBlank(citId, "citId non valorizzato");
		checkNotBlank(idIstanza, "idistanza non valorizzato");
		checkUtenteAutorizzatoOrDelegato(citId);

		ModelIstanza resp = invokeGetListaIstanzaPrenotazione();

		return Response.ok(resp).type(MediaType.APPLICATION_JSON_TYPE).build();
	}

	private ModelIstanza invokeGetListaIstanzaPrenotazione() {

		JsonNode resp = null;
		try {
			resp = vacApiRestInvoker.invoke("/AppuntamentiVaccinali/GetIstanzaPrenotazione?idIstanza=" + this.idIstanza,
					HttpMethod.GET, (JsonNode) null, null, null);
		} catch (org.springframework.web.client.HttpClientErrorException hcee) {

			String responseBodyAsString = hcee.getResponseBodyAsString();
			if (HttpStatus.BAD_REQUEST.equals(hcee.getStatusCode())
					&& responseBodyAsString.contains("Non ci sono istanze per questo assistito")) {
				// Quando non trova elementi ritorna 400 con:
//				{
//				    "Message": "Non ci sono istanze per questo assistito"
//				}
				resp = null;
			} else {
				throw hcee;
			}
		}
		// resp = fakeResponseTest(resp);

		ModelIstanza result = new ModelIstanza();
		if (resp == null) {
			return result;
		}

		Iterator<JsonNode> elements = resp.elements();

		JsonNode i = elements.next();

		ModelIstanza mi = new ModelIstanza();
		mi.setIdIstanza(asText(i.get("IdIstanza")));
		mi.setIdAppuntamento(asText(i.get("IdAppuntamento")));
		mi.setMotivazione(asText(i.get("MotivoVariazione")));
		mi.setIdStato(asText(i.get("IdStato")));
		mi.setDescrizioneStato(asText(i.get("DescrizioneStato")));
		mi.setNoteRisposta(asText(i.get("NoteRisposta")));
		mi.setNoteRichiesta(asText(i.get("NoteRichiesta")));

		List<ModelVaccino> vaccini = new ArrayList<>();
		JsonNode vacciniJn = i.get("Vaccini");
		if (vacciniJn != null) {
			Iterator<JsonNode> elementsVaccini = vacciniJn.elements();
			while (elementsVaccini.hasNext()) {
				JsonNode jsVaccino = elementsVaccini.next();
				ModelVaccino mv = new ModelVaccino();
				mv.setCodice(asText(jsVaccino.get("CodiceVaccino")));
				mv.setDescrizione(asText(jsVaccino.get("DescrizioneVaccino")));
				vaccini.add(mv);
			}
		}
		mi.setVaccini(vaccini);

		return mi;
	}
}
