/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisantacc.dto.apisantacc;

import java.util.Objects;
import java.util.ArrayList;
import java.util.Date;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonCreator;
import javax.validation.constraints.*;
import io.swagger.annotations.*;



public class PayloadDoloreNuovo   {
  // verra' utilizzata la seguente strategia serializzazione degli attributi: [explicit-as-modeled] 
  
  private String descrizione = null;
  private String areaInteressata = null;
  private Date dataInizio = null;
  private Date dataFine = null;
  private String intensitaValore = null;

  /**
   * La descrizione inserita dall&#39;utente
   **/
  
  @ApiModelProperty(value = "La descrizione inserita dall'utente")
  @JsonProperty("descrizione") 
 
  public String getDescrizione() {
    return descrizione;
  }
  public void setDescrizione(String descrizione) {
    this.descrizione = descrizione;
  }

  /**
   * L&#39;area interessata inserita dall&#39;utente
   **/
  
  @ApiModelProperty(value = "L'area interessata inserita dall'utente")
  @JsonProperty("area_interessata") 
 
  public String getAreaInteressata() {
    return areaInteressata;
  }
  public void setAreaInteressata(String areaInteressata) {
    this.areaInteressata = areaInteressata;
  }

  /**
   * La data di inizio del dolore
   **/
  
  @ApiModelProperty(value = "La data di inizio del dolore")
  @JsonProperty("data_inizio") 
 
  public Date getDataInizio() {
    return dataInizio;
  }
  public void setDataInizio(Date dataInizio) {
    this.dataInizio = dataInizio;
  }

  /**
   * La data di inizio del dolore
   **/
  
  @ApiModelProperty(value = "La data di inizio del dolore")
  @JsonProperty("data_fine") 
 
  public Date getDataFine() {
    return dataFine;
  }
  public void setDataFine(Date dataFine) {
    this.dataFine = dataFine;
  }

  /**
   * Identificativo dell&#39;intensità
   **/
  
  @ApiModelProperty(value = "Identificativo dell'intensità")
  @JsonProperty("intensita_valore") 
 
  public String getIntensitaValore() {
    return intensitaValore;
  }
  public void setIntensitaValore(String intensitaValore) {
    this.intensitaValore = intensitaValore;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    PayloadDoloreNuovo payloadDoloreNuovo = (PayloadDoloreNuovo) o;
    return Objects.equals(descrizione, payloadDoloreNuovo.descrizione) &&
        Objects.equals(areaInteressata, payloadDoloreNuovo.areaInteressata) &&
        Objects.equals(dataInizio, payloadDoloreNuovo.dataInizio) &&
        Objects.equals(dataFine, payloadDoloreNuovo.dataFine) &&
        Objects.equals(intensitaValore, payloadDoloreNuovo.intensitaValore);
  }

  @Override
  public int hashCode() {
    return Objects.hash(descrizione, areaInteressata, dataInizio, dataFine, intensitaValore);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PayloadDoloreNuovo {\n");
    
    sb.append("    descrizione: ").append(toIndentedString(descrizione)).append("\n");
    sb.append("    areaInteressata: ").append(toIndentedString(areaInteressata)).append("\n");
    sb.append("    dataInizio: ").append(toIndentedString(dataInizio)).append("\n");
    sb.append("    dataFine: ").append(toIndentedString(dataFine)).append("\n");
    sb.append("    intensitaValore: ").append(toIndentedString(intensitaValore)).append("\n");
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

