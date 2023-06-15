package csv

import (
	"encoding/csv"
	"os"
	"reflect"
	"strconv"
)

type CidKeyInfo struct {
	Name string `json:"name"`
	Cid  string `json:"cid"`
	Key  string `json:"key"`
}

func WriteToCsv(data []CidKeyInfo, filename string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	var header []string
	val := reflect.Indirect(reflect.ValueOf(data[0]))
	for i := 0; i < val.NumField(); i++ {
		header = append(header, val.Type().Field(i).Name)
	}
	writer.Write(header)

	for _, obj := range data {
		var row []string
		val := reflect.Indirect(reflect.ValueOf(obj))
		for i := 0; i < val.NumField(); i++ {
			row = append(row, val.Field(i).String())
		}
		writer.Write(row)
	}

	if err := writer.Error(); err != nil {
		return err
	}

	return nil
}

func ReadFromCsv(filename string) ([]CidKeyInfo, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.TrimLeadingSpace = true
	lines, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	var data []CidKeyInfo
	for i, line := range lines {
		if i == 0 {
			// Skipping header
			continue
		}
		var obj CidKeyInfo
		val := reflect.ValueOf(&obj).Elem()
		for i := 0; i < val.NumField(); i++ {
			field := val.Field(i)
			switch field.Kind() {
			case reflect.String:
				field.SetString(line[i])
			case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
				if v, err := strconv.ParseInt(line[i], 10, 64); err == nil {
					field.SetInt(v)
				}
			case reflect.Float32, reflect.Float64:
				if v, err := strconv.ParseFloat(line[i], 64); err == nil {
					field.SetFloat(v)
				}
			default:
			}
		}
		data = append(data, obj)
	}

	return data, nil
}
