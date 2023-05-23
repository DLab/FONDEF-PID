package cl.dlab.sma.core.gen;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.sql.Connection;
import java.util.List;
import java.util.Properties;

import javax.xml.bind.JAXBContext;

import org.jboss.forge.roaster.Roaster;
import org.jboss.forge.roaster.model.source.JavaClassSource;
import org.jboss.forge.roaster.model.source.MethodSource;

import cl.dlab.sma.core.BaseService;
import cl.dlab.sma.service.vo.InputVO;
import cl.dlab.sma.service.vo.QueryVO;
import cl.dlab.sma.service.vo.VOBase;
import cl.dlab.sma.core.sql.BaseSQL;
import cl.dlab.sma.util.PropertyUtil;

public class GeneraXml
{
	private static final String PATH_VO = "../SMAService/src/cl/dlab/sma/service/vo/";
	private static final String PATH_RAD = "../SMAService/src/cl/dlab/sma/core/sql/rad/";
	private static final String PATH_SERVICE = "../SMAService/src/cl/dlab/sma/core/";
	
	public static void main(String[] args) throws Exception
	{
		JAXBContext context = JAXBContext.newInstance(EntityType.class);
		String database_type = "mysql";
		//String database_type = "sqlserver";
		PropertyUtil.loadSqlCompatibility("/Users/manolocabello/servers/apache-tomcat-9.0.63/bin/", database_type);
		//String savePath = "C:/Program Files/Apache Software Foundation/Tomcat 8.0/bin/resources/cl/dlab/sma/core/sql/sma/";
		String savePath = "/Users/manolocabello/servers/apache-tomcat-9.0.63/webapps/sma/resources/cl/dlab/sma/core/sql/sma/";
		Properties afoconfig = new Properties();
		afoconfig.load(new FileInputStream("/Users/manolocabello/servers/apache-tomcat-9.0.63/bin/sql-compatibilities-" + database_type + ".config"));
		System.setProperty("CALL-PROCEDURE", afoconfig.getProperty("CALL-PROCEDURE"));
		System.setProperty("OPEN-PROCEDURE", afoconfig.getProperty("OPEN-PROCEDURE"));
		System.setProperty("CLOSE-PROCEDURE", afoconfig.getProperty("CLOSE-PROCEDURE"));
		System.setProperty("LOCK_TABLE", afoconfig.getProperty("LOCK_TABLE"));
		System.setProperty("UNLOCK_TABLE", afoconfig.getProperty("UNLOCK_TABLE"));
		
		File[] dir = new File("data/" + database_type).listFiles();
		for (File f : dir)
		{
			if (f.getName().endsWith(".xml"))
			{
				writeXml(context, savePath, f);
			}
		}
		
		dir = new File("data").listFiles();
		for (File f : dir)
		{
			if (f.getName().endsWith(".xml"))
			{
				writeXml(context, savePath, f);
			}
		}
	}
	private static void writeXml(JAXBContext context, String savePath, File f) throws Exception
	{
		EntityType entity = (EntityType)context.createUnmarshaller().unmarshal(f);
		String name = f.getName().substring(0, f.getName().length() - 4);
		loadEntity(entity, savePath + "/" + name);
		
		JavaClassSource outputJavaClass = createJavaVO(name + "OutputVO", entity.getField(), VOBase.class, false);
		writeJavaClass(PATH_VO, outputJavaClass);

		List<FieldType> fields;
		if (entity.getTableName() == null)
		{
			fields = entity.getQuery().get(0).getField();
		}
		else
		{
			fields = entity.getAkeys();
		}
		JavaClassSource javaClass = createJavaVO(name + "InputVO", fields, InputVO.class, true);
		javaClass.getMethod("getOutputClass")
		  .setPublic()
		  .setBody("return " + outputJavaClass.getName() + ".class;")
		  .setReturnType("Class<" + outputJavaClass.getName() + ">");
		
		writeJavaClass(PATH_VO, javaClass);

		if (entity.getTableName() != null)
		{
			for (QueryType query : entity.getQuery())
			{
				javaClass = createJavaVO(name + capitalize(query.getId()) + "InputVO", query.getField(), QueryVO.class, true);
				
				javaClass.getMethod("getOutputClass")
				  .setPublic()
				  .setBody("return " + outputJavaClass.getName() + ".class;")
				  .setReturnType("Class<" + outputJavaClass.getName() + ">");

				javaClass.getMethod("getQueryName")
				  .setPublic()
				  .setBody("return \"" + query.getId() + "\";")
				  .setReturnType(String.class);
				
				writeJavaClass(PATH_VO, javaClass);
				
			}
		}
		writeJavaClass(PATH_SERVICE, createJavaService(name, entity.getTableName() == null));
		writeJavaClass(PATH_RAD, createJavaRad(name));		
	}
	private static void writeJavaClass(String path, JavaClassSource javaClass) throws IOException
	{
		String fileName = path + javaClass.getName() + ".java";
		String fileNameNexus = path.replace("/src/", "/nexus/") + javaClass.getName() + ".java";
		File f = new File(fileName);
		File fNexus = new File(fileNameNexus);
		if (f.exists() || fNexus.exists())
		{
			fileName = fileName.replace("/src/", "/bck/");
		}
		FileOutputStream fo = new FileOutputStream(fileName);
		fo.write(javaClass.toString().getBytes());
		fo.close();
		//System.out.println(javaClass);
		
	}
	private static String capitalize(String name)
	{
		return Character.toUpperCase(name.charAt(0)) + name.substring(1);
	}
	private static JavaClassSource createJavaRad(String javaName) 
	{
		JavaClassSource javaClass = Roaster.create(JavaClassSource.class);
		javaClass.setPackage("cl.dlab.sma.core.sql.rad").setName(javaName);

		javaClass.extendSuperType(BaseSQL.class);
		javaClass.addMethod()
			.setName(javaName)
			.setPublic()
			.setConstructor(true)
			.setBody("super();")
			.addThrows(Exception.class)
			;

		MethodSource<JavaClassSource> method = javaClass.addMethod()
			.setName(javaName)
			.setPublic()
			.setConstructor(true)
			.setBody("super(con, commitAndClose);")
			.addThrows(Exception.class)
			;
		method.addParameter(Connection.class, "con");
		method.addParameter(Boolean.class, "commitAndClose");
		;
		
		return javaClass;
	}	
	private static JavaClassSource createJavaService(String javaName, boolean useVO) 
	{
		JavaClassSource javaClass = Roaster.create(JavaClassSource.class);
		javaClass.setPackage("cl.dlab.sma.core").setName(javaName + "Service");

		javaClass.extendSuperType(BaseService.class);
		javaClass.addMethod()
			.setName(javaName + "Service")
			.setPublic()
			.setConstructor(true)
			.setBody("super();")
			;

		javaClass.addMethod()
			.setName(javaName + "Service")
			.setPublic()
			.setConstructor(true)
			.setBody("super(con);")
			.addParameter(Connection.class, "con");
			;
		
		javaClass.addMethod()
			.setName("consultar")
			.setPublic()
			.setBody("return new cl.dlab.sma.core.sql.rad." + javaName + "(con, con == null).consultar(input);")
			.setReturnType("cl.dlab.sma.service.vo.RespuestaVO<cl.dlab.sma.service.vo." + javaName +"OutputVO>")
			.addThrows(Exception.class)
			.addParameter("cl.dlab.sma.service.vo.InputVO", "input");
			;
		if (!useVO)
		{
			javaClass.addMethod()
				.setName("consultar")
				.setPublic()
				.setBody("return new cl.dlab.sma.core.sql.rad." + javaName + "(con, true).consultar(input);")
				.setReturnType("java.util.HashMap<String, Object>")
				.addThrows(Exception.class)
				.addParameter("java.util.HashMap<String, Object>", "input");
				;
			
			javaClass.addMethod()
				.setName("eliminar")
				.setPublic()
				.setBody("new cl.dlab.sma.core.sql.rad." + javaName + "(con, true).eliminar(input);")
				.addThrows(Exception.class)
				.addParameter("java.util.HashMap<String, Object>", "input");
				;

			javaClass.addMethod()
				.setName("guardar")
				.setPublic()
				.setBody("new cl.dlab.sma.core.sql.rad." + javaName + "(con, true).guardar(input);")
				.addThrows(Exception.class)
				.addParameter("java.util.HashMap<String, Object>", "input");
				;
				
		}
		return javaClass;
	}		
	private static JavaClassSource createJavaVO(String javaName, List<FieldType> fields, Class<? extends VOBase> base, boolean in) 
	{
		JavaClassSource javaClass = Roaster.create(JavaClassSource.class);
		javaClass.setPackage("cl.dlab.sma.service.vo").setName(javaName);
		//javaClass.addAnnotation(SuppressWarnings.class).setStringValue("serial");
		javaClass.extendSuperType(base);

		if (fields != null)
		{
			for (FieldType f : fields)
			{
				String property = capitalize(f.getProperty());
				System.out.println("property:" + property + "**" + f.getType());
				boolean isJoin = f.getType().equals(Type.Join);
				boolean isFunction = f.getType().equals(Type.Function);
				System.out.println("prop:" + property + "**" + f.getType());
				if (in && (isJoin || isFunction))
				{
					continue;
				}
				if (!isJoin && !isFunction)
				{
					javaClass.addMethod()
					  .setName("set" + property)
					  .setPublic()
					  .setBody("set(\"" + f.getProperty() + "\", " + f.getProperty() + ");")
					  .addParameter(f.getType().getType(), f.getProperty());
				}
				javaClass.addMethod()
				  .setName("get" + property)
				  .setPublic()
				  .setBody("return get(\"" + f.getProperty() + "\");")
				  .setReturnType(isJoin || isFunction ? f.getTypeRef().getType() : f.getType().getType());
				
			}
		}
		return javaClass;
		
	}
	private static void loadEntity(EntityType entity, String fileName) throws Exception
	{
		entity.init();
		ObjectOutputStream oo = new ObjectOutputStream(new FileOutputStream(fileName));
		oo.writeObject(entity);
		oo.close();
	}
}
