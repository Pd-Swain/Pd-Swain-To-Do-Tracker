package com.niit.user.service;

import com.niit.user.model.User;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWTSecurityToken implements TokenGenerator{
    @Override
    public Map<String, String> generateToken(User user) {
        String webToken=null;

        JwtBuilder jwtBuilder= Jwts.builder();

        webToken=jwtBuilder.setSubject(user.getEmail()).setIssuedAt(new Date()).signWith(SignatureAlgorithm.HS256,"secret").compact();

        Map<String,String> tokenMap=new HashMap<String,String>();
        tokenMap.put("token",webToken);
        tokenMap.put("message","User Successfully LoggedIn");

        return tokenMap;
    }
}
