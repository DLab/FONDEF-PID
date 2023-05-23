import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;

import org.apache.commons.jexl2.Expression;
import org.apache.commons.jexl2.JexlContext;
import org.apache.commons.jexl2.JexlEngine;
import org.apache.commons.jexl2.MapContext;

public class LeeExp
{
	private static final JexlEngine jexl;
	
	static
	{
		jexl = new JexlEngine();
		jexl.setCache(512);
		jexl.setLenient(false);
		jexl.setSilent(false);
		
	}
	private static Object eval(Expression exp, HashMap<String, Object> element)
	{
		JexlContext context = new MapContext(new HashMap<String, Object>(element));
		context.set("Integer", 0);
		context.set("String", "");
		context.set("Long", 0L);
		context.set("Double", 0D);
		return exp.evaluate(context);
	}
	
	private static Object leeParametro(String param, BufferedReader in) throws Exception
	{
		System.out.print("\nPor favor, ingrese el tipo de dato de '" + param + "' (N: Numeirc, C:Caracter, B: Booleano):");
		String type = in.readLine();
		System.out.print("Por favor, ingrese el valor de '" + param + "':");
		String valor = in.readLine();
		char t = type.toUpperCase().charAt(0);
		switch (t)
		{
		case 'N':
			return Long.valueOf(valor);
		case 'B':
			return Boolean.valueOf(valor);
		default:
			return valor;
		}
	}
	private static StringBuilder replace(StringBuilder buff, String exp, String replace)
	{
		String[] arr = new String[]{exp.toLowerCase(), exp.toUpperCase()};
		for (int i = 0; i < arr.length; i++)
		{
			int index = 0;
			String e = arr[i];
			while((index = buff.indexOf(e, index)) != -1)
			{
				buff.replace(index, index + e.length(), replace);
				index = index + 1;
			}
		}
		return buff;
	}
	private static HashMap<String, Object> leeParams(BufferedReader in, StringBuilder buff) throws Exception
	{
		HashMap<String, Object> params = new HashMap<String, Object>();
		
		int index = 0;
		while((index = buff.indexOf("'", index)) != -1)
		{
			int index2 = buff.indexOf("'", index + 1);
			String param = buff.substring(index + 1, index2).replaceAll(" ", "_");
			buff.replace(index, index2 + 1, param);
			params.put(param, leeParametro(param, in));
			index = index + 1;
		}
		
		return params;
	}
	public static void main(String[] args) throws Exception
	{
		BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
		System.out.println("Digite expresion a evaluar, los par\u00E1metros deben ir entre comilla simple (')");
		StringBuilder condition = new StringBuilder(in.readLine());
		
		HashMap<String, Object> params = leeParams(in, condition);
		System.out.println("\nExpresion:" + condition);
		Expression exp = jexl.createExpression(replace(replace(replace(condition, " and ", " && "), " or ", " || "), " not(", " !(").toString());
		
		System.out.println("\n**********\nResultado de la Evaluaci\u00F3n:" + eval(exp, params));
		
	}
}
