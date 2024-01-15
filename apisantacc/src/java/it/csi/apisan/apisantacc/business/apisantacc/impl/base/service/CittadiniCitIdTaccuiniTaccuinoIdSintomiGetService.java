/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisantacc.business.apisantacc.impl.base.service;

import java.util.List;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import it.csi.apisan.apisantacc.business.apisantacc.impl.base.TaccTaccuinoRESTBaseService;
import it.csi.apisan.apisantacc.business.mapper.ModelSintomoSintomoMapper;
import it.csi.apisan.apisantacc.dto.apisantacc.ModelSintomo;
import it.csi.dma.RisultatoCodice;
import it.csi.dma.dmaclbluc.GetSintomiRequest;
import it.csi.dma.dmaclbluc.GetSintomiResponse;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class CittadiniCitIdTaccuiniTaccuinoIdSintomiGetService extends TaccTaccuinoRESTBaseService {

	String citId; 
	GetSintomiRequest sintomiRequest;	
	
	
	public CittadiniCitIdTaccuiniTaccuinoIdSintomiGetService(String shibIdentitaCodiceFiscale, String xRequestId,
			String xForwardedFor, String xCodiceServizio, String citId, Long taccuinoId, Integer limit,
			Integer offset, String ordinamento, String da, String a, SecurityContext securityContext,
			HttpHeaders httpHeaders) {
		super(securityContext, httpHeaders);
		this.citId = citId;				 		
		sintomiRequest=newRequestCommonGet(taccuinoId, limit, offset, ordinamento, da, a);
	}


	@Override
	protected Response execute() {
		checkNotBlank(xRequestID, "xRequestID non impostato");
		checkNotBlank(xCodiceServizio, "xRequestID non impostato");
		checkNotBlank(shibIdentitaCodiceFiscale, "Cittadino non autenticato");
		checkNotBlank(xForwardedFor, "xForwardedFor non impostato");
		//checkNotNull(requestCommonGet.get, re);
		
		
		
		GetSintomiResponse response = taccuinoService.getSintomi(sintomiRequest);
		if (!response.getEsito().name().equalsIgnoreCase(RisultatoCodice.SUCCESSO.value())) {
			toRESTException(response.getErrori());
		} else {
			List<ModelSintomo> sintomi =  new ModelSintomoSintomoMapper().fromList(response.getListaSintomi().getSintomo());
			return Response.ok(sintomi).build();
		}
		return null;
		
	}
	
	
	private GetSintomiRequest newRequestCommonGet( 
	Long taccuinoId, 
	Integer limit,
	Integer offset, 
	String ordinamento, 	
	String da, 
	String a) {
		GetSintomiRequest request = new GetSintomiRequest();
		request= (GetSintomiRequest)setGenericGetRequest(request, taccuinoId, limit, offset, ordinamento, da, a);
		request.setPaziente(citId);				
		return request;
	}
}
