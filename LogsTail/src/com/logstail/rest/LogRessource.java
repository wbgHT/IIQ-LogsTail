package com.logstail.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import sailpoint.integration.ListResult;
import sailpoint.rest.plugin.AllowAll;
import sailpoint.rest.plugin.BasePluginResource;
import sailpoint.tools.GeneralException;
import org.apache.commons.io.input.ReversedLinesFileReader;


@Path("LogsTail")
@Produces({"application/json"})
public class LogRessource extends BasePluginResource  {

    @Override  
    public String getPluginName() {  
        return "LogsTail";
    }  
    
    /**
     * Get log files from log4j2.properties
     * 
     * @return List
     * @throws GeneralException
     */
	@GET
	@Path("logfiles")
	@AllowAll
    public ListResult getLogFiles() {
		List res = new ArrayList();
		
		String log4jfile = getSettingString("LOG4J_FILE");
		String pattern = ".fileName=";
		
		File file = new File(log4jfile);
		if(file.exists()) {
			Reader reader;
			try {
				reader = new FileReader(file);
				BufferedReader br = new BufferedReader(reader);
				String line = "";
		        while((line = br.readLine()) != null) {
		        	if(line.contains(pattern) && !line.startsWith("#")) {
		        		String fileName = line.split(pattern)[1];
		        		res.add(fileName);
		        	}
		        }
		        br.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return new ListResult(res, res.size());
    }

    
    /**
     * Get last N lines from log file
     * 
     * @return List
     * @throws GeneralException
     */
	@GET
	@Path("logs")
	@AllowAll
	public ListResult getLogsData(@QueryParam("filePath") String filePath, @QueryParam("lines") int lines)
	{
		List res = new ArrayList();

		File file = new File(filePath);
		int counter = 0; 
		ReversedLinesFileReader object;
		
		try {
			object = new ReversedLinesFileReader(file, Charset.defaultCharset());
			while(counter < lines) {
			    res.add(object.readLine());
			    counter++;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		Collections.reverse(res);
		return new ListResult(res, res.size());
	}
	
}
