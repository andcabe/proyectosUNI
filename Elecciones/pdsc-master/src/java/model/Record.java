/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

/**
 *
 * @author andres
 */
import java.util.Date;

public class Record {
    
    private int useId;
    private Date useDate;
    private enum type{
        CONGRESO, AUTONOMICAS, MUNICIPALES, PARLAMENTOEU
    };
    private double threshold;
    private int year;
    private int month;
}
