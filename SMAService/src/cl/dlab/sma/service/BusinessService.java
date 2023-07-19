package cl.dlab.sma.service;

import java.io.ByteArrayInputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

import cl.dlab.sma.core.AccionService;
import cl.dlab.sma.core.AccionesxFuncionRolService;
import cl.dlab.sma.core.AnaliticasService;
import cl.dlab.sma.core.BaseDatosService;
import cl.dlab.sma.core.ComunaService;
import cl.dlab.sma.core.EstacionesService;
import cl.dlab.sma.core.FuncionService;
import cl.dlab.sma.core.ParametroService;
import cl.dlab.sma.core.RegionService;
import cl.dlab.sma.core.ReguladosService;
import cl.dlab.sma.core.RolService;
import cl.dlab.sma.core.TipoArchivoService;
import cl.dlab.sma.core.TipoDatoService;
import cl.dlab.sma.core.TipoErrorService;
import cl.dlab.sma.core.TipoValidacionService;
import cl.dlab.sma.core.UsuarioService;
import cl.dlab.sma.util.Param;
import cl.dlab.sma.util.PropertyUtil;
import cl.dlab.sma.util.Utils;

public class BusinessService
{
	private static SimpleDateFormat FMT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static SimpleDateFormat monthFormatter2 = new SimpleDateFormat("MM-yy");
	
	
	public HashMap<Integer, HashMap<Integer, HashMap<String, Object>>> obtenerAccionesxFuncionRol(HashMap<String, Object> input) throws Exception
	{
		return new AccionesxFuncionRolService().consultar(input);
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> obtenerAcciones(HashMap<String, Object> input) throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new AccionService().consultar(input).get("listData");
	}
	public ArrayList<HashMap<String, Object>> consultaFunciones() throws Exception
	{
		return new FuncionService().consultar(new HashMap<String, Object>());
	}
	public HashMap<String, Object> consultarRoles(HashMap<String, Object> input) throws Exception
	{
		return new RolService().consultar(input);
	}
	public HashMap<String, Object> guardarRol(HashMap<String, Object> input) throws Exception
	{
		return new RolService().guardar(input);
	}
	public void eliminarRol(HashMap<String, Object> input) throws Exception
	{
		new RolService().eliminar(input);
	}
	public HashMap<String, Object> consultaDetalleRol(HashMap<String, Object> input) throws Exception
	{
		HashMap<String, Object> result = new HashMap<String, Object>();
		result.put("accionesxFuncion", new AccionesxFuncionRolService().consultar(input));
		//POR PVG
		result.put("tiposDeProductos", new HashMap<>());// new TipoProductoRolService().consultar(input));
		return result;
	}

	public HashMap<String, Object> consultarUsuarios(HashMap<String, Object> input) throws Exception
	{
		return new UsuarioService().consultar(input);
	}
	public void guardarUsuario(HashMap<String, Object> input) throws Exception
	{
		new UsuarioService().guardar(input);
	}
	public void eliminarUsuario(HashMap<String, Object> input) throws Exception
	{
		new UsuarioService().eliminar(input);
	}
	
	public HashMap<String, Object> validaUsuario(HashMap<String, Object> input) throws Exception
	{
		return new UsuarioService().validaUsuario(input);
	}
	public HashMap<String, Object> changePassword(HashMap<String, Object> input) throws Exception
	{
		return new UsuarioService().changePassword(input);
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaParametros() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new ParametroService().consultar(new HashMap<String, Object>()).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaAnaliticas() throws Exception
	{
		ArrayList<HashMap<String, Object>> list = (ArrayList<HashMap<String, Object>>)new AnaliticasService().consultar(new HashMap<String, Object>()).get("listData");
		ArrayList<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
		for (HashMap<String, Object> hs : list) {
			String codigoPadre = (String)hs.get("codigoPadre");
			if (codigoPadre != null)
			{
				result.add(hs);
			}
		}
		return result;
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaBaseDeDatos() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new BaseDatosService().consultar(new HashMap<String, Object>()).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaRegiones() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new RegionService().consultar(new HashMap<String, Object>()).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaComunas() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new ComunaService().consultar(new HashMap<String, Object>()).get("listData");
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaTiposDeArchivo() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new TipoArchivoService().consultar(new HashMap<String, Object>()).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaTiposDeErrores() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new TipoErrorService().consultar(new HashMap<String, Object>()).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaTiposDeDatos() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new TipoDatoService().consultar(new HashMap<String, Object>()).get("listData");
	}
	public HashMap<String, Object> consultaDetalleTiposDeArchivo(HashMap<String, Object> input) throws Exception
	{
		return new TipoArchivoService().consultaDetalleTiposDeArchivo(input);
	}
	
	public void guardarTiposDeArchivo(HashMap<String, Object> input) throws Exception
	{
		new TipoArchivoService().guardar(input);
	}
	public void eliminarTiposDeArchivo(HashMap<String, Object> input) throws Exception
	{
		new TipoArchivoService().eliminar(input);
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaTiposDeValidaciones() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new TipoValidacionService().consultar(new HashMap<String, Object>()).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaRegulados(HashMap<String, Object> input) throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new ReguladosService().consultar(input).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaEstaciones(HashMap<String, Object> input) throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new EstacionesService().consultar(input).get("listData");
	}
	
	
	public String validaArchivo(HashMap<String, Object> input) throws Exception
	{
		JSONObject obj = new JSONObject(new ValidaArchivo().validar(input));
		boolean conError = !obj.getString("resultado").equals("OK");
		obj.put("conError", conError);
		if (conError)
		{
			obj.put("msgError", obj.getString("descripcion"));
		}
		else
		{
			if (obj.getBoolean("rechazaArchivo"))
			{
				obj.put("conError", true);
				obj.put("msgError", "Se rechaza archivo completo");
			}			
			obj.put("result", obj.get("errores"));
		}
		return obj.toString();
	}
	private Param getParam(String key, HashMap<String, Object> input)
	{
		return new Param(key, input.get(key));
	}
	private Param getParamFecha(String key, HashMap<String, Object> input, String defaultValue)
	{
		String fecha = (String)input.get(key);
		if (fecha == null)
		{
			fecha = defaultValue;
		}
		return new Param(key, fecha.substring(0, 19).replace("T", " "));
	}
	
	@SuppressWarnings("unchecked")
	private Param getParam(String key, String subKey, HashMap<String, Object> input)
	{
		HashMap<String, Object> hs = (HashMap<String, Object>)input.get(key);
		return new Param(key, hs.get(subKey));
	}
	public String getAnaliticaDeDatos(HashMap<String, Object> input) throws Exception
	{
		String fechaInicio = PropertyUtil.getProperty("defaul_fecha_inicio");
		String fechaTermino = FMT.format(new Date());
		String url = PropertyUtil.getProperty("URL_ANALITICA_DATOS");
		return Utils.sendPostData(url, getParamFecha("inicio", input, fechaInicio), getParamFecha("termino", input, fechaTermino), getParam("tipoDato", "codigo", input)
									 , getParam("estacion", "idRegulado", input).setKey("regulado"), getParam("estacion", "id", input)
									 , getParam("fuente", "codigo", input)
									 , getParam("analitica", input)
									 , getParam("additionalData", input));
	}
	private double getPow(double a, double b, double c, double d, double e, double x)
	{
		x = x + a;
		return  b *Math.pow(x, 2) + c * x + d;
	}
	public HashMap<String, Object> getEstaciones(HashMap<String, Object> input) throws Exception
	{	
		return new EstacionesService().getEstaciones(input);

	}
	public HashMap<String, Object> getPrediccionIA(HashMap<String, Object> input) throws Exception
	{
		HashMap<String, Object> result = new HashMap<String, Object>();
		String[] parameters = new String[] {"Vanadio Total", "Wolframio Disuelto", "Turbiedad", "Sulfuro", "Sulfato Disuelto"};

		Calendar cal = Calendar.getInstance();
		result.put("hoy", monthFormatter2.format(cal.getTime()));
		
		ArrayList<String> xaxis = new ArrayList<String>();
		cal.add(Calendar.YEAR, 10);
		long max = cal.getTime().getTime();

		cal.add(Calendar.YEAR, -20);
		while (cal.getTime().getTime() < max)
		{
			xaxis.add(monthFormatter2.format(cal.getTime()));
			cal.add(Calendar.MONTH, 1);
		}
		result.put("maxFecha", xaxis.get(xaxis.size() - 1));
		
		result.put("xaxis", xaxis);
		
		
		cal.add(Calendar.YEAR, 30);
		ArrayList<HashMap<String, Object>> series = new ArrayList<HashMap<String,Object>>();
		
		Random random = new Random();
		for (String param : parameters) {
			HashMap<String, Object> serie = new HashMap<String, Object>();
			serie.put("name", param);
			double a = random.nextDouble() * 10 - 5;
			double b = random.nextDouble() * 10 - 5;
			double c = random.nextDouble() * 10 - 5 ;
			double d = random.nextDouble() * 10 - 5;
			double e = random.nextDouble() * 10 - 5;
			
			ArrayList<Double> list = new ArrayList<Double>();
			for (int i = 0; i < xaxis.size(); i++) 
			{
				list.add(getPow(a, b, c, d, e, i));
			}
			serie.put("data", list);
			series.add(serie);
		}
		
		result.put("series", series);
		return result;
	}	
	public ArrayList<HashMap<String, Object>> getPlantillaTipoArchivo(byte[] bytes) throws Exception
	{
		ArrayList<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
		XSSFWorkbook wo = new XSSFWorkbook(new ByteArrayInputStream(bytes));
		
		for (int i = 0; i < wo.getNumberOfSheets(); i++) {
			XSSFSheet sheet = wo.getSheetAt(i);
			StringBuilder buff = new StringBuilder();
			String sep = "";
			XSSFRow row = sheet.getRow(0);
			for (int c = 0; c < row.getLastCellNum(); c++) {
				String value = row.getCell(c).getStringCellValue();
				if (value != null && value.trim().length() > 0)
				{
					buff.append(sep).append(value);
					sep = "\t";
				}
			}
			HashMap<String, Object> hs = new HashMap<String, Object>();
			hs.put("nombre", sheet.getSheetName());
			hs.put("isNew", true);
			hs.put("encabezado", buff.toString());
			hs.put("validaciones", new ArrayList<HashMap<String, Object>>());
			result.add(hs);
		}
		wo.close();
		 
		return result;
	}
	
}
