package cl.dlab.sma.service;

import java.io.ByteArrayInputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;

import cl.dlab.sma.core.AccionService;
import cl.dlab.sma.core.AccionesxFuncionRolService;
import cl.dlab.sma.core.AnaliticasService;
import cl.dlab.sma.core.BaseDatosService;
import cl.dlab.sma.core.ClasificacionService;
import cl.dlab.sma.core.ComunaService;
import cl.dlab.sma.core.EstacionesService;
import cl.dlab.sma.core.FuncionService;
import cl.dlab.sma.core.MonitoreoOcurrenciaService;
import cl.dlab.sma.core.ParametroService;
import cl.dlab.sma.core.RegionService;
import cl.dlab.sma.core.ReguladosService;
import cl.dlab.sma.core.RolService;
import cl.dlab.sma.core.TipoArchivoService;
import cl.dlab.sma.core.TipoDatoService;
import cl.dlab.sma.core.TipoErrorService;
import cl.dlab.sma.core.TipoOperacionService;
import cl.dlab.sma.core.TipoValidacionService;
import cl.dlab.sma.core.UsuarioService;
import cl.dlab.sma.util.Param;
import cl.dlab.sma.util.PropertyUtil;
import cl.dlab.sma.util.Utils;

public class BusinessService
{
	private static SimpleDateFormat FMT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	
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
	public ArrayList<HashMap<String, Object>> consultaFuenteDeDatos() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new TipoDatoService().consultar(new HashMap<String, Object>()).get("listData");
	}
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap<String, Object>> consultaTipoOperacion() throws Exception
	{
		return (ArrayList<HashMap<String, Object>>)new TipoOperacionService().consultar(new HashMap<String, Object>()).get("listData");
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
	private String getAnalitica(HashMap<String, Object> input, String sUrl) throws Exception
	{
		String fechaInicio = PropertyUtil.getProperty("defaul_fecha_inicio");
		String fechaTermino = FMT.format(new Date());
		String url = PropertyUtil.getProperty(sUrl);
		return Utils.sendPostData(url, getParamFecha("inicio", input, fechaInicio), getParamFecha("termino", input, fechaTermino), getParam("tipoDato", "codigo", input)
									 , getParam("estacion", "idRegulado", input).setKey("regulado"), getParam("estacion", "id", input)
									 , getParam("fuente", "codigo", input)
									 , getParam("analitica", input)
									 , getParam("additionalData", input));
	}
	public String getAnaliticaDeDatos(HashMap<String, Object> input) throws Exception
	{
		return getAnalitica(input, "URL_ANALITICA_DATOS");
	}
	@SuppressWarnings("unchecked")
	public HashMap<String, Object> getUnidadesMedicion(HashMap<String, Object> input) throws Exception
	{	
		String baseDato = (String)((HashMap<String, Object>)input.get("baseDato")).get("codigo");
		if (baseDato.equals("AIRE")) {
			return new EstacionesService().getEstaciones(input);
		}
		else if (baseDato.equals("SeguimientoBio")) {
			return new MonitoreoOcurrenciaService().getMediciones(input);
		}
		
		return new HashMap<String, Object>();
	}
	public String getPrediccionIA(HashMap<String, Object> input) throws Exception
	{
		return getAnalitica(input, "URL_ANALITICAIA_DATOS");
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
	
	public ArrayList<HashMap<String, Object>> changeClasificacionBiodiversidad(HashMap<String, Object> input) throws Exception
	{
		return new ClasificacionService().consultar(input);
	}
	public ArrayList<HashMap<String, Object>> getClasificacionBiodiversidad(HashMap<String, Object> input) throws Exception
	{
		return new ClasificacionService().consultar(input);
	}
	public HashMap<String, Object> downloadAnalisis(HashMap<String, Object> input) throws Exception
	{
		return new ReportesUtil().downloadAnalisis(input);
	}
	public HashMap<String, Object> downloadDespliegueTerritorial(HashMap<String, Object> input) throws Exception
	{
		return new ReportesUtil().downloadDespliegueTerritorial(input);
	}
	
	
}
