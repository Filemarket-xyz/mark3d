package domain

import "fmt"

type HiddenFileMetadata struct {
	Name string
	Type string
	Size int64
}

type TokenMetadata struct {
	Id             int64
	Name           string
	Description    string
	Image          string
	ExternalLink   string
	HiddenFile     string
	HiddenFileMeta *HiddenFileMetadata
	License        string
	LicenseUrl     string
	Properties     []*MetadataProperty
	Rankings       []*MetadataProperty
	Stats          []*MetadataProperty
	Categories     []string
	Subcategories  []string
	Tags           []string
}

type MetadataProperty struct {
	TraitType   string
	DisplayType string
	Value       string
	MaxValue    string
}

type HiddenFileMetadataIpfs struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Size int64  `json:"size"`
}

type MetadataPropertyIpfs struct {
	TraitType   string      `json:"traitType"`
	DisplayType string      `json:"displayType"`
	Value       interface{} `json:"value"`
	MaxValue    interface{} `json:"maxValue"`
}

type TokenMetadataIpfs struct {
	Id             int64                   `json:"-"`
	Name           string                  `json:"name"`
	Description    string                  `json:"description"`
	Image          string                  `json:"image"`
	ExternalLink   string                  `json:"external_link"`
	HiddenFile     string                  `json:"hidden_file"`
	HiddenFileMeta *HiddenFileMetadataIpfs `json:"hidden_file_meta"`
	License        string                  `json:"license"`
	LicenseUrl     string                  `json:"license_url"`
	Attributes     []*MetadataPropertyIpfs `json:"attributes"`
	Categories     []string                `json:"categories"`
	Subcategories  []string                `json:"subcategories"`
	Tags           []string                `json:"tags"`
}

func IpfsMetadataToDomain(m TokenMetadataIpfs) TokenMetadata {
	res := TokenMetadata{
		Name:          m.Name,
		Description:   m.Description,
		Image:         m.Image,
		ExternalLink:  m.ExternalLink,
		HiddenFile:    m.HiddenFile,
		License:       m.License,
		LicenseUrl:    m.LicenseUrl,
		Categories:    m.Categories,
		Subcategories: m.Subcategories,
		Tags:          m.Tags,
	}
	if m.HiddenFileMeta != nil {
		res.HiddenFileMeta = &HiddenFileMetadata{
			Name: m.HiddenFileMeta.Name,
			Type: m.HiddenFileMeta.Type,
			Size: m.HiddenFileMeta.Size,
		}
	}
	for _, a := range m.Attributes {
		if s, ok := a.Value.(string); ok {
			res.Properties = append(res.Properties, &MetadataProperty{
				TraitType:   a.TraitType,
				DisplayType: a.DisplayType,
				Value:       s,
			})
		} else if f, ok := a.Value.(float64); ok {
			var maxValue string
			if mf, ok := a.MaxValue.(float64); ok {
				maxValue = fmt.Sprintf("%.0f", mf)
			}
			if a.DisplayType == "number" {
				res.Stats = append(res.Stats, &MetadataProperty{
					TraitType:   a.TraitType,
					DisplayType: a.DisplayType,
					Value:       fmt.Sprintf("%.0f", f),
					MaxValue:    maxValue,
				})
			} else {
				res.Rankings = append(res.Stats, &MetadataProperty{
					TraitType:   a.TraitType,
					DisplayType: a.DisplayType,
					Value:       fmt.Sprintf("%.0f", f),
					MaxValue:    maxValue,
				})
			}
		} else {
			res.Properties = append(res.Properties, &MetadataProperty{
				TraitType:   a.TraitType,
				DisplayType: a.DisplayType,
				Value:       fmt.Sprintf("%v", a.Value),
			})
		}
	}
	return res
}
