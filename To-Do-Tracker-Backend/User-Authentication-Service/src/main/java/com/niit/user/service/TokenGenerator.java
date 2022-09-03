package com.niit.user.service;

import com.niit.user.model.User;

import java.util.Map;

public interface TokenGenerator {
    Map<String,String> generateToken(User user);
}
