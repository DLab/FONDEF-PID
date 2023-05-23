package cl.dlab.pid.util;

import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

import cl.dlab.pid.calidaddelaire.ImportaDatosSMAJob;

public class TaskUtil {

	private static TaskUtil instance;
		
	public static TaskUtil getInstance()
	{
		if (instance == null)
		{
			instance = new TaskUtil();
		}
		return instance;
	}
	
	private Scheduler scheduler;
	private TaskUtil() {}
	
	public void programmingTask() throws SchedulerException
	{
		scheduler = new StdSchedulerFactory().getScheduler();
		scheduler.start();  
		programingImportData();
		programingPromedios();
	}
	private void programingImportData() throws SchedulerException {
		String expression = PropertyUtil.getProperty("dlab.pid.cron.expression.importdata");
		System.out.println("Programando trigger:" + expression);
		JobDetail job = JobBuilder.newJob(ImportaDatosSMAJob.class).withIdentity("myTaskImportData", "group1").build();
		Trigger trigger = TriggerBuilder.newTrigger().withIdentity("cronTriggerImportData", "group1").withSchedule(CronScheduleBuilder.cronSchedule(expression)).build();		
        scheduler.scheduleJob(job, trigger);  
	}
	private void programingPromedios() throws SchedulerException {
		String expression = PropertyUtil.getProperty("dlab.pid.cron.expression.promedios");
		System.out.println("Programando trigger:" + expression);
		JobDetail job = JobBuilder.newJob(PromediosJob.class).withIdentity("myTaskPromedios", "group1").build();
		Trigger trigger = TriggerBuilder.newTrigger().withIdentity("cronTriggerPromedios", "group1").withSchedule(CronScheduleBuilder.cronSchedule(expression)).build();		
        scheduler.scheduleJob(job, trigger);  
	}
	public void shutdownTask() throws SchedulerException
	{
		scheduler.shutdown();
	}
	
}
