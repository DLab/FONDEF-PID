package cl.dlab.sma.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.codec.binary.Base64;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ReportesUtil {
	
	private static final String[][] FIELDS_AIRE = new String[][] {{"ufId", "ID"}, {"regulado", "Regulado"}, {"idProceso", "ID"}, {"estacion", "Estacion"}, {"latitud", "Latitud"}, {"longitud", "Longitud"}, {"valorMaximo", "Valor_Maximo"}, {"valor", "Valor"}, {"percentage", "Porcentaje"}};
	private static final String[][] FIELDS_BIODIVERSIDAD = new String[][] {{"especie", "Especie"}, {"nombreComun", "nombre_comun"}, {"latitud", "Latitud"}, {"longitud", "Longitud"}, {"valorMaximo", "Valor_Maximo"}, {"valor", "Valor"}, {"percentage", "Porcentaje"}};
	
	private byte[] decodeBase64(String base64Info) throws IOException
	{
        String[] arr = base64Info.replaceAll(" ", "+").split("base64,");
        return Base64.decodeBase64(arr[1]);
    }	
	
	private XSSFCellStyle getHeaderStyle(XSSFWorkbook workbook)
	{
		XSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short)16);
		font.setFontName("Calibri");
		font.setColor(IndexedColors.BLACK.getIndex());
		font.setBold(true);
		font.setItalic(false);
		
		XSSFCellStyle style = workbook.createCellStyle();
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setFont(font);		
		return style;
	}
	private XSSFCellStyle getLabelStyle(XSSFWorkbook workbook)
	{
		XSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short)14);
		font.setFontName("Calibri");
		font.setColor(IndexedColors.BLACK.getIndex());
		font.setBold(true);
		font.setItalic(false);
		
		XSSFCellStyle style = workbook.createCellStyle();
		style.setAlignment(HorizontalAlignment.LEFT);
		style.setFont(font);		
		return style;
	}
	private XSSFCellStyle getTitleStyle(XSSFWorkbook workbook)
	{
		XSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short)20);
		font.setFontName("Calibri");
		font.setColor(IndexedColors.BLACK.getIndex());
		font.setBold(true);
		font.setItalic(false);
		
		XSSFCellStyle style = workbook.createCellStyle();
		style.setAlignment(HorizontalAlignment.CENTER);
		style.setFont(font);		
		return style;
	}
	protected String getFecha(String property, HashMap<String, Object> input)
	{
		String fecha = (String)input.get(property);
		return fecha == null ? null : fecha.substring(0, 19).replace("T", " ");
	}
	private void setFilter(XSSFRow row, XSSFCellStyle labelStyle, String label, String value)
	{
		XSSFCell cell = row.createCell(0);
		cell.setCellStyle(labelStyle);
		cell.setCellValue(label);

		cell = row.createCell(1);
		cell.setCellValue(value);
	}
	@SuppressWarnings("unchecked")
	private byte[] writeExcelFile(HashMap<String, Object> data, Properties screen) throws Exception
	{
		HashMap<String, Object> seachData = (HashMap<String, Object>)data.get("searchData");
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFCellStyle header = getHeaderStyle(workbook);
		
		String title = (String)((HashMap<String, Object>)data.get("title")).get("text");
		XSSFSheet sheet = workbook.createSheet(title);
		
		ArrayList<HashMap<String, Object>> series = (ArrayList<HashMap<String, Object>>)data.get("_series");

		String inicio = getFecha("inicio", seachData);
		String termino = getFecha("termino", seachData);
		String tipoDato = (String)((HashMap<String, Object>)seachData.get("tipoDato")).get("codigo");
		String fuente = (String)((HashMap<String, Object>)seachData.get("fuente")).get("descripcion");
		String estacion = (String)((HashMap<String, Object>)seachData.get("estacion")).get("descripcion");
		String regulado = (String)((HashMap<String, Object>)seachData.get("regulado")).get("descripcion");
		Boolean logScale = (Boolean)data.get("logScale");

		int r = 0;
		XSSFCellStyle labelStyle = getLabelStyle(workbook);
		setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Tipo_Dato"), tipoDato);
		setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Fuente_de_datos"), fuente);
		setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Fecha"), (inicio == null ? "" : inicio) + "-" + (termino == null ? "" : termino));
		setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Regulado"), regulado);
		setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Estacion"), estacion);
		setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Escala_logaritmica"), logScale != null && logScale ? screen.getProperty("Si") : screen.getProperty("No"));
		
		
		XSSFRow row = sheet.createRow(r);
		XSSFCell cell = row.createCell(0);
		sheet.addMergedRegion(new CellRangeAddress(r, r, 0, series.size() + 1));
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue(title);
		r++;
		
		row = sheet.createRow(r++);
		int c = 0;
		cell = row.createCell(c++);
		cell.setCellStyle(header);
		cell.setCellValue(screen.getProperty("Fecha"));

		for (HashMap<String, Object> serie : series) {
			cell = row.createCell(c++);
			cell.setCellStyle(header);
			cell.setCellValue((String)serie.get("name"));
		}
		ArrayList<String> fechas = (ArrayList<String>)((HashMap<String, Object>)data.get("xAxis")).get("data");
		while(true)
		{
			row = sheet.createRow(r);
			cell = row.createCell(0);
			cell.setCellValue(fechas.get(r));
			for(int col = 0; col < series.size(); col++)
			{
				cell = row.createCell(col + 1);
				Object value = ((ArrayList<Object>)series.get(col).get("data")).get(r);
				if (value instanceof Double)
				{
					cell.setCellValue((Double)value);
				}
				else if (value instanceof Integer)
				{
					cell.setCellValue((Integer)value);
				}
				else if (value instanceof String)
				{
					cell.setCellValue((String)value);
				}
								
			}
			r++;
			if (r >= fechas.size()) {
				break;
			}
		}
		
		
		ByteArrayOutputStream bo = new ByteArrayOutputStream();
		workbook.write(bo);
		return bo.toByteArray();
	}
	private String getCodigo(HashMap<String, Object> input, String key)
	{
		return (String)getProperty(input, "codigo", key);
	}
	@SuppressWarnings("unchecked")
	private Object getProperty(HashMap<String, Object> input, String property, String key)
	{
		HashMap<String, Object> hs = (HashMap<String, Object>)input.get(key);
		return hs == null ? null : hs.get(property);
	}
	
	@SuppressWarnings("unchecked")
	private byte[] writeDespliegueTerritorial(ArrayList<HashMap<String, Object>> data, HashMap<String, Object> searchData, Properties screen) throws Exception
	{
		String baseDato = (String)((HashMap<String, Object>)searchData.get("baseDato")).get("codigo");
		String tipoOperacion = searchData.get("tipoOperacion") == null ? null : (String)searchData.get("tipoOperacion");
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet(screen.getProperty("Data"));
		int r = 0;
		
		String inicio = getFecha("inicio", searchData);
		String termino = getFecha("termino", searchData);
		String tipoDato = getCodigo(searchData, "tipoDato");			

		XSSFCellStyle labelStyle = getLabelStyle(workbook);

		if (baseDato.equals("AIRE")) {
			String fuente = (String)((HashMap<String, Object>)searchData.get("fuente")).get("descripcion");

			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Tipo_Dato"), tipoDato);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Fuente_de_datos"), fuente);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Fecha"), (inicio == null ? "" : inicio) + "-" + (termino == null ? "" : termino));
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Tipo_Operacion"), tipoOperacion == null ? "" : screen.getProperty(tipoOperacion));
			if (tipoOperacion != null)
			{
				setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Filtro"), (String)searchData.get("filtro"));
			}
			
			return writeDespliegueTerritorialAire(workbook, sheet, data, searchData, r, FIELDS_AIRE, tipoOperacion == null ? 6 : FIELDS_AIRE.length, screen);
		}
		else {
			
			String nombreComun = (String)searchData.get("nombreComun");
			String region = (String)getProperty(searchData, "descripcion", "region");
			String reino = getCodigo(searchData, "reino");
			String filodivision = getCodigo(searchData, "filodivision");
			String clase = getCodigo(searchData, "clase");
			String orden = getCodigo(searchData, "orden");
			String familia = getCodigo(searchData, "familia");
			String genero = getCodigo(searchData, "genero");
			String epitetoespecifico = getCodigo(searchData, "epitetoespecifico");
			
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Tipo_Dato"), tipoDato);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Fecha"), (inicio == null ? "" : inicio) + "-" + (termino == null ? "" : termino));
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("nombre_comun"), nombreComun);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Region"), region);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Reino"), reino);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Filo_Division"), filodivision);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Clase"), clase);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("order"), orden);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Familia"), familia);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Genero"), genero);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Epiteto_especifico"), epitetoespecifico);
			setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Tipo_Operacion"), tipoOperacion == null ? "" : screen.getProperty(tipoOperacion));
			if (tipoOperacion != null)
			{
				setFilter(sheet.createRow(r++), labelStyle, screen.getProperty("Filtro"), (String)searchData.get("filtro"));
			}
			
			

			return writeDespliegueTerritorialAire(workbook, sheet, data, searchData, r, FIELDS_BIODIVERSIDAD, tipoOperacion == null ? 4 : FIELDS_BIODIVERSIDAD.length, screen);
		}
		
	}
	private byte[] writeDespliegueTerritorialAire(XSSFWorkbook workbook, XSSFSheet sheet, ArrayList<HashMap<String, Object>> data, HashMap<String, Object> searchData, int r, String[][] fields, int maxCols, Properties screen) throws Exception
	{
		XSSFCellStyle header = getHeaderStyle(workbook);
		String title = screen.getProperty("Despliegue_Territorial");
		XSSFRow row = sheet.createRow(r);
		XSSFCell cell = row.createCell(0);
		sheet.addMergedRegion(new CellRangeAddress(r, r, 0, maxCols - 1));
		cell.setCellStyle(getTitleStyle(workbook));
		cell.setCellValue(title);
		r++;
		
		row = sheet.createRow(r++);
		for (int i = 0; i < maxCols; i++) {
			cell = row.createCell(i);
			cell.setCellStyle(header);
			cell.setCellValue(screen.getProperty(fields[i][1]));
		}
		for (HashMap<String, Object> item : data) {
			row = sheet.createRow(++r);
			for (int i = 0; i < maxCols; i++) {
				cell = row.createCell(i);
				Object value = item.get(fields[i][0]);
				if (value instanceof String)
				{
					cell.setCellValue((String)value);
				}
				else if (value instanceof Double)
				{
					cell.setCellValue((Double)value);
				}
				else if (value instanceof Integer)
				{
					cell.setCellValue((Integer)value);
				}
				
			}
			
		}
		
		ByteArrayOutputStream bo = new ByteArrayOutputStream();
		workbook.write(bo);
		return bo.toByteArray();
	}	
	@SuppressWarnings("unchecked")
	public HashMap<String, Object> downloadAnalisis(HashMap<String, Object> input) throws Exception
	{
		byte[] img = decodeBase64((String)input.get("img"));		
		byte[] excelFile = writeExcelFile((HashMap<String, Object>)input.get("data"), (Properties)input.get("screen"));
		//System.out.println(data);
		
		
		ByteArrayOutputStream bo = new ByteArrayOutputStream();
		ZipOutputStream zo = new ZipOutputStream(bo);
		
		zo.putNextEntry(new ZipEntry("image.png"));
		zo.write(img);
		zo.closeEntry();

		zo.putNextEntry(new ZipEntry("excelFile.xlsx"));
		zo.write(excelFile);
		zo.closeEntry();
		
		zo.close();
		input.put("zipFile", bo.toByteArray());
		
		return input;
	}

	@SuppressWarnings("unchecked")
	public HashMap<String, Object> downloadDespliegueTerritorial(HashMap<String, Object> input) throws Exception
	{
		byte[] img = decodeBase64((String)input.get("img"));
		byte[] excelFile = writeDespliegueTerritorial((ArrayList<HashMap<String, Object>>)input.get("data"), (HashMap<String, Object>)input.get("searchData"), (Properties)input.get("screen"));
		//System.out.println(data);
		
		
		ByteArrayOutputStream bo = new ByteArrayOutputStream();
		ZipOutputStream zo = new ZipOutputStream(bo);
		
		zo.putNextEntry(new ZipEntry("image.png"));
		zo.write(img);
		zo.closeEntry();

		zo.putNextEntry(new ZipEntry("excelFile.xlsx"));
		zo.write(excelFile);
		zo.closeEntry();
		
		zo.close();
		input.put("zipFile", bo.toByteArray());
		
		return input;
	}
	
}
