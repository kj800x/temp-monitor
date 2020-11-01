v 20130925 2
C 40000 40000 0 0 0 title-B.sym
C 40700 43400 1 90 0 diode-1.sym
{
T 40100 43800 5 10 0 0 90 0 1
device=DIODE
T 40600 44100 5 10 1 1 0 0 1
refdes=D2
T 40700 43400 5 10 0 0 0 0 1
footprint=DIODE_LAY 400.fp
}
C 42900 41500 1 0 0 asic-res-4.sym
{
T 44100 41800 5 8 0 0 0 0 1
device=RESISTOR
T 43000 41800 5 10 1 1 0 0 1
refdes=R2
T 43500 41800 5 10 1 1 0 0 1
value=250 Ω
T 42900 41500 5 10 0 0 0 0 1
footprint=ACY400
}
N 41400 44600 41400 44400 4
N 40500 44400 42300 44400 4
N 44000 41600 46800 41600 4
C 41600 43100 1 0 0 motor.sym
{
T 42600 43700 5 10 0 0 0 0 1
device=Motor
T 42600 43900 5 10 1 1 0 0 1
refdes=M4
T 42600 43700 5 10 0 0 0 0 1
slot=1
T 42600 44500 5 10 0 0 0 0 1
footprint=BT8.fp
}
C 40700 43100 1 0 0 motor.sym
{
T 41700 43700 5 10 0 0 0 0 1
device=Motor
T 41700 43900 5 10 1 1 0 0 1
refdes=M3
T 41700 43700 5 10 0 0 0 0 1
slot=1
T 41700 44500 5 10 0 0 0 0 1
footprint=BT8.fp
}
N 40500 43200 42300 43200 4
N 40500 43200 40500 43400 4
N 40500 44300 40500 44400 4
C 40700 48900 1 90 0 diode-1.sym
{
T 40100 49300 5 10 0 0 90 0 1
device=DIODE
T 40700 48900 5 10 0 0 0 0 1
footprint=DIODE_LAY 400.fp
T 40600 49600 5 10 1 1 0 0 1
refdes=D1
}
N 41400 50100 41400 49900 4
N 40500 49900 42300 49900 4
C 40700 48600 1 0 0 motor.sym
{
T 41700 49200 5 10 0 0 0 0 1
device=Motor
T 41700 50000 5 10 0 0 0 0 1
footprint=BT8.fp
T 41700 49400 5 10 1 1 0 0 1
refdes=M1
T 41700 49200 5 10 0 0 0 0 1
slot=1
}
N 40500 48700 42300 48700 4
N 40500 48700 40500 48900 4
N 40500 49800 40500 49900 4
C 41600 48600 1 0 0 motor.sym
{
T 42600 49200 5 10 0 0 0 0 1
device=Motor
T 42600 50000 5 10 0 0 0 0 1
footprint=BT8.fp
T 42600 49400 5 10 1 1 0 0 1
refdes=M2
T 42600 49200 5 10 0 0 0 0 1
slot=1
}
C 51800 48600 1 0 0 PJ-102AH.sym
{
T 51800 49900 5 10 1 1 0 0 1
device=PJ-102AH
T 51800 50700 5 10 0 0 0 0 1
footprint=BARREL.fp
T 51800 49700 5 10 1 1 0 0 1
refdes=J1
}
N 52800 49400 54300 49400 4
T 52100 49700 9 10 1 0 0 0 1
9V 3A
C 43800 46600 1 0 0 ADAFRUIT-3965.sym
{
T 45900 50200 5 10 1 1 0 0 1
device=ADAFRUIT-3965
T 46100 50300 5 10 0 0 0 0 1
footprint=8HEAD_M.fp
T 45900 50000 5 10 1 1 0 0 1
refdes=U2
}
C 45400 47200 1 0 0 gnd-1.sym
N 45500 47500 45500 47700 4
C 55100 44500 1 0 1 connector10-1.sym
{
T 53200 47500 5 10 0 0 0 6 1
device=CONNECTOR_10
T 55100 46800 5 10 1 1 0 6 1
refdes=CONN1
T 55100 44500 5 10 0 0 0 0 1
footprint=JTAGIC3-50MIL-SMD.fp
}
N 54000 46500 54500 46500 4
C 53300 46300 1 0 0 5V-plus-1.sym
N 54500 46300 53500 46300 4
C 49700 47700 1 0 0 3.3V-plus-1.sym
C 52800 46100 1 0 0 3.3V-plus-1.sym
N 53000 46100 54500 46100 4
C 52400 45800 1 0 0 gnd-1.sym
N 51200 45500 54500 45500 4
N 51200 45300 54500 45300 4
N 51200 45100 54500 45100 4
N 54000 44900 54500 44900 4
C 45100 50200 1 0 0 3.3V-plus-1.sym
C 42900 47000 1 0 0 asic-res-4.sym
{
T 44100 47300 5 8 0 0 0 0 1
device=RESISTOR
T 43000 47300 5 10 1 1 0 0 1
refdes=R1
T 43500 47300 5 10 1 1 0 0 1
value=250 Ω
T 42900 47000 5 10 0 0 0 0 1
footprint=ACY400
}
N 44000 47100 44400 47100 4
C 42700 40600 1 0 1 ssrelay-CPC1708.sym
{
T 42400 41850 5 10 1 1 0 6 1
refdes=U4
T 42400 42700 5 10 0 0 0 6 1
footprint=i4-PAC.fp
T 42400 40600 5 10 1 1 0 6 1
device=CPC1708
}
C 42700 46100 1 0 1 ssrelay-CPC1708.sym
{
T 42400 47350 5 10 1 1 0 6 1
refdes=U3
T 42400 48200 5 10 0 0 0 6 1
footprint=i4-PAC.fp
T 42400 46100 5 10 1 1 0 6 1
device=CPC1708
}
C 42600 40700 1 0 0 gnd-1.sym
C 40500 40700 1 0 0 gnd-1.sym
C 42600 46200 1 0 0 gnd-1.sym
C 40500 46200 1 0 0 gnd-1.sym
N 42900 41600 42700 41600 4
N 42900 47100 42700 47100 4
C 54100 48800 1 0 0 5v-dc-dc.sym
{
T 54508 50863 5 10 0 0 0 0 1
footprint=R-78E5.0-0.5.fp
T 54500 50100 5 10 1 1 0 0 1
device=R-78E5.0-0.5
T 54500 49900 5 10 1 1 0 0 1
refdes=PS1
}
C 54800 48000 1 0 0 gnd-1.sym
N 54900 48300 54900 48800 4
C 49300 47700 1 0 0 5V-plus-1.sym
C 56000 49400 1 0 0 5V-plus-1.sym
N 56200 49400 55500 49400 4
C 53800 46500 1 0 0 9V-plus-1.sym
C 52800 49400 1 0 0 9V-plus-1.sym
C 41200 50100 1 0 0 9V-plus-1.sym
C 41200 44600 1 0 0 9V-plus-1.sym
B 51600 47900 5300 2700 14 0 0 2 100 100 0 -1 -1 -1 -1 -1
N 41400 48700 41400 47600 4
N 41400 47600 40600 47600 4
N 40600 47600 40600 47100 4
N 41400 43200 41400 42100 4
N 41400 42100 40600 42100 4
N 40600 42100 40600 41600 4
B 40200 45900 4000 4700 14 0 0 2 100 100 0 -1 -1 -1 -1 -1
B 40200 40400 4000 4700 14 0 0 2 100 100 0 -1 -1 -1 -1 -1
N 54900 48500 53000 48500 4
N 53000 48500 53000 49100 4
N 53000 49100 52800 49100 4
C 53400 49400 1 270 0 capacitor-1.sym
{
T 54100 49200 5 10 0 0 270 0 1
device=CAPACITOR
T 53300 48700 5 10 1 1 0 0 1
refdes=C1
T 54300 49200 5 10 0 0 270 0 1
symversion=0.1
T 53400 49400 5 10 0 0 0 0 1
footprint=RCY100
T 53700 48700 5 10 1 1 0 0 1
value=10 uF
}
N 56200 48500 54900 48500 4
C 56000 49400 1 270 0 capacitor-1.sym
{
T 56700 49200 5 10 0 0 270 0 1
device=CAPACITOR
T 55900 48700 5 10 1 1 0 0 1
refdes=C2
T 56900 49200 5 10 0 0 270 0 1
symversion=0.1
T 56000 49400 5 10 0 0 0 0 1
footprint=RCY100
T 56300 48700 5 10 1 1 0 0 1
value=10 uF
}
T 40200 50700 9 10 1 0 0 0 1
Motor 1
T 40200 45200 9 10 1 0 0 0 1
Motor 2
T 51600 50700 9 10 1 0 0 0 1
Power
C 47800 41800 1 0 0 BeagleBoardGreen-1.sym
{
T 34150 42150 5 8 0 1 0 0 1
device=BEAGLEBOARDBLACK
T 33050 42350 5 8 0 1 0 0 1
footprint=BBB.fp
T 50700 47300 5 8 1 1 0 0 1
refdes=U1
}
N 49500 47500 49500 47700 4
N 49700 47500 49700 47700 4
N 49700 47700 49900 47700 4
C 49000 42100 1 0 0 gnd-1.sym
N 46400 49300 46800 49300 4
N 46800 49300 46800 46200 4
N 46800 46200 47800 46200 4
N 46400 49000 46700 49000 4
N 46700 49000 46700 46100 4
N 46700 46100 47800 46100 4
N 44400 45800 47800 45800 4
N 47800 45600 46800 45600 4
N 46800 41600 46800 45600 4
N 54500 45900 52700 45900 4
N 52700 45900 52700 46100 4
N 52700 46100 52500 46100 4
N 47800 45400 47400 45400 4
N 47500 41800 54000 41800 4
N 54000 41800 54000 44900 4
N 54500 44700 54200 44700 4
N 54200 44700 54200 41700 4
N 47400 41700 54200 41700 4
N 47400 41700 47400 45400 4
N 47500 45300 47800 45300 4
N 47500 45300 47500 41800 4
N 51200 46100 52100 46100 4
N 52100 46100 52100 45700 4
N 52100 45700 54500 45700 4
B 44600 47100 2800 3500 14 0 0 2 100 100 0 -1 -1 -1 -1 -1
N 44400 45800 44400 47100 4
T 44600 50700 9 10 1 0 0 0 1
Pressure Sensor
T 50000 40100 9 10 1 0 0 0 1
1
T 51500 40100 9 10 1 0 0 0 1
1
T 50000 40400 9 10 1 0 0 0 1
Schematic 3.sch
T 50000 40700 9 24 1 0 0 0 1
Motor Control Circuit
T 53900 40400 9 10 1 0 0 0 1
3
T 53900 40100 9 10 1 0 0 0 1
kj800x