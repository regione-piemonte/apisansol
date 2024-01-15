/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanpag.dto.ptw;

import java.util.Objects;

import org.codehaus.jackson.annotate.JsonProperty;

import io.swagger.annotations.ApiModelProperty;


public class StatoTransazione {
	
	private Integer statoErogazione;

	
	@ApiModelProperty(value = "")
	  @JsonProperty("stato_erogazione") 
	public Integer getStatoErogazione() {
		return statoErogazione;
	}

	public void setStatoErogazione(Integer statoErogazione) {
		this.statoErogazione = statoErogazione;
	}
	
	
	 @Override
	  public boolean equals(Object o) {
	    if (this == o) {
	      return true;
	    }
	    if (o == null || getClass() != o.getClass()) {
	      return false;
	    }
	    StatoTransazione statoTransazione = (StatoTransazione) o;
	    return Objects.equals(statoErogazione, statoTransazione.statoErogazione);
	  }

	  @Override
	  public int hashCode() {
	    return Objects.hash(statoErogazione);
	  }

	  @Override
	  public String toString() {
	    StringBuilder sb = new StringBuilder();
	    sb.append("class StatoTransazione {\n");
	    
	    sb.append("    statoErogazione: ").append(toIndentedString(statoErogazione)).append("\n");
	    sb.append("}");
	    return sb.toString();
	  }

	  /**
	   * Convert the given object to string with each line indented by 4 spaces
	   * (except the first line).
	   */
	  private String toIndentedString(Object o) {
	    if (o == null) {
	      return "null";
	    }
	    return o.toString().replace("\n", "\n    ");
	  }
}
