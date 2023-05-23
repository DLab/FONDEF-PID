package cl.dlab.pid.calidaddelaire;

import cl.dlab.pid.util.PropertyUtil;

public class GeneraArchivosSma
{
	public static void main(String[] args) throws Exception
	{
		PropertyUtil.load("calidaddelaire.properties");
		new GeneraArchivos().process(PropertyUtil.getProperty("dlab.pid.listaufids.sma").split(","),DataBase.ApiRest_SMA); 
	}
}
