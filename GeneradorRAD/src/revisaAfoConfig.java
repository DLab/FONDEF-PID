import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;

public class revisaAfoConfig
{
	public static void main(String[] args) throws Exception
	{
		HashMap<String, String> js = new HashMap<>();
		HashMap<String, String> java = new HashMap<>();
		ArrayList<String> list = new ArrayList<String>();
		try(BufferedReader br = new BufferedReader(new FileReader("/Users/juancabellog/Downloads/afo.config")))
		{
			String line;
			while((line = br.readLine()) != null)
			{
				line = line.trim();
				if (line.length() == 0 || line.charAt(0) == '#')
				{
					continue;
				}
				line = line.split("=")[0].trim();
				if (line.startsWith("ID-"))
				{
					line = line.substring(3);
				}
				list.add(line);
			}
		}
		System.out.println(list);
		getFiles(js, "/Users/juancabellog/Documents/afo/workspace/afo-it/app/components/", ".js");
		getFiles(java, "/Users/juancabellog/Documents/afo/workspace/DartaService/src/", ".java");
		
		for (int i = list.size() - 1; i >= 0; i--)
		{
			String s = list.get(i);
			if (constains(s, js))
			{
				list.remove(i);
				continue;
			}
			if (constains(s, java))
			{
				list.remove(i);
				continue;
			}
		}
		System.out.println("NO SE USAN");
		System.out.println(list);
	}
	private static boolean constains(String s, HashMap<String, String> hs)
	{
		for (String key : hs.keySet())
		{
			String code = hs.get(key);
			if (code.contains(s))
			{
				return true;
			}
		}
		return false;
	}
	private static void getFiles(HashMap<String, String> files, String path, String sufix) throws Exception
	{
		File[] dir = new File(path).listFiles();
		for (File file : dir)
		{
			if (file.isDirectory())
			{
				getFiles(files, file.getPath(), sufix);
				continue;
			}
			if (file.getPath().endsWith(sufix))
			{
				try(FileInputStream fi = new FileInputStream(file))
				{
					byte[] b = new byte[fi.available()];
					fi.read(b);
					files.put(file.getPath(), new String(b));
				}
			}
			
			
		}
		
	}
}
