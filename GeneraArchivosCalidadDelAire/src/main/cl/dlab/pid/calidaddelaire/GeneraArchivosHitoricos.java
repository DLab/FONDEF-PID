package cl.dlab.pid.calidaddelaire;

import cl.dlab.pid.util.PropertyUtil;

public class GeneraArchivosHitoricos
{
	public static void main(String[] args) throws Exception
	{
		PropertyUtil.load("calidaddelaire.properties");
		new GeneraArchivos().process(PropertyUtil.getProperty("dlab.pid.listaufids.historicos").split(","), DataBase.Historica);
	}
}
