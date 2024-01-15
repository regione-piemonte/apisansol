package it.csi.apisan.apisanfarm.business.apisanfarm;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import java.util.Set;
import java.util.HashSet;

import it.csi.apisan.apisanfarm.business.apisanfarm.impl.CittadiniApiServiceImpl;
import it.csi.apisan.apisanfarm.business.apisanfarm.impl.ModalitaErogazioneApiServiceImpl;

@ApplicationPath("/")
public class RestApplication extends Application {


    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new HashSet<Class<?>>();
        resources.add(CittadiniApiServiceImpl.class);
        resources.add(ModalitaErogazioneApiServiceImpl.class);

        return resources;
    }




}