package cl.dlab.pid.util;

import java.util.Date;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class PromediosJob implements Job
{

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		
		try {
			System.out.println("Llama a promedios:" + new Date());
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.err.println("Error al ejecutar carga de datos:" + e.getMessage());
			e.printStackTrace();
		}
	}
	
}