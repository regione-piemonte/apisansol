/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanscerev.business.apisanscerev.mapper;

import java.util.ArrayList;
import java.util.List;

import it.csi.apisan.apisanscerev.dto.apisanscerev.ModelAmbulatorioOrarioGiorno;
import it.csi.apisan.apisanscerev.dto.apisanscerev.ModelMedicoLoccsiAmbulatorio;
import it.csi.apisan.apisanscerev.dto.loccsi.Feature;
import it.csi.apisan.apisanscerev.dto.loccsi.Propertie;
import it.csi.apisan.apisanscerev.util.GiornoSettimana;

public class ModelMedicoLoccsiAmbulatorioFeatureMapper extends BaseMapper<ModelMedicoLoccsiAmbulatorio, Feature> {

	@Override
	public Feature to(ModelMedicoLoccsiAmbulatorio source) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ModelMedicoLoccsiAmbulatorio from(Feature dest) {
		if(dest == null) {
			return null;
		}
		ModelMedicoLoccsiAmbulatorio source = new ModelMedicoLoccsiAmbulatorio();
		 
		Propertie destProp = dest.getProperties(); 
		if(dest.getProperties() != null) {

			source.setCap(destProp.getCapAmbulatorio());
			source.setComune(destProp.getComuneAmbulatorio());
			if(dest.getGeometry() != null) {
				source.setCoordinate(new GeoJsonPuntoGeometryMapper().from((dest.getGeometry())));
			}
			source.setEmail(destProp.getIndirizzoEmailAmbulatorio());
			source.setId(destProp.getIdAmbulatorio());
			source.setIndirizzo(destProp.getIndirizzoAmbulatorio());
			source.setNote(destProp.getNoteAmbulatorio());
			source.setTelefono(destProp.getTelefonoAmbulMedico());
			List<ModelAmbulatorioOrarioGiorno> giorniOrari = new ArrayList<ModelAmbulatorioOrarioGiorno>();		
			giorniOrari.add(new ModelAmbulatorioOrarioGiornoStringMapper(GiornoSettimana.LUNEDI, destProp.getOrarioAmbLunedi()).getModelOrarioGiorno());
			giorniOrari.add(new ModelAmbulatorioOrarioGiornoStringMapper(GiornoSettimana.MARTEDI, destProp.getOrarioAmbMartedi()).getModelOrarioGiorno());
			giorniOrari.add(new ModelAmbulatorioOrarioGiornoStringMapper(GiornoSettimana.MERCOLEDI, destProp.getOrarioAmbMercoledi()).getModelOrarioGiorno());
			giorniOrari.add(new ModelAmbulatorioOrarioGiornoStringMapper(GiornoSettimana.GIOVEDI, destProp.getOrarioAmbGiovedi()).getModelOrarioGiorno());
			giorniOrari.add(new ModelAmbulatorioOrarioGiornoStringMapper(GiornoSettimana.VENERDI, destProp.getOrarioAmbVenerdi()).getModelOrarioGiorno());
			giorniOrari.add(new ModelAmbulatorioOrarioGiornoStringMapper(GiornoSettimana.SABATO, destProp.getOrarioAmbSabato()).getModelOrarioGiorno());
			giorniOrari.add(new ModelAmbulatorioOrarioGiornoStringMapper(GiornoSettimana.DOMENICA, destProp.getOrarioAmbDomenica()).getModelOrarioGiorno());

			source.setOrari(giorniOrari);
			source.setProvincia(destProp.getProvinciaAmbulatorio());
			try {
				source.setRapportoLavoroId( Integer.parseInt( destProp.getIdRaplavAmbulatorio()));
			}catch(NumberFormatException e) {

			}
		}
		
		
		return source;
	}

}
