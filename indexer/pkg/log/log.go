package log

import (
	"fmt"
	"go.uber.org/zap/zapcore"
	"sync"
	"time"

	"go.uber.org/zap"
)

type Fields map[string]interface{}

type Logger interface {
	Info(msg string, args Fields)
	Infof(msg string, args ...any)
	Debug(msg string, args Fields)
	Debugf(msg string, args ...any)
	Warn(msg string, args Fields)
	Warnf(msg string, args ...any)
	Error(msg string, err error, args Fields)
	Errorf(msg string, err error, args ...any)
	Fatal(msg string, args Fields)
	Fatalf(msg string, args ...any)
	WithFields(fields Fields) Logger
	Flush() error
}

type StandardLogger struct {
	logger *zap.Logger
}

var (
	once            sync.Once
	singletonLogger Logger
)

func GetLogger() Logger {
	once.Do(func() {
		singletonLogger = NewLogger()
	})

	return singletonLogger
}

func NewLogger() Logger {
	encoderConfig := zapcore.EncoderConfig{
		TimeKey:        "ts",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     customTimeEncoder,
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.FullCallerEncoder,
	}

	config := zap.Config{
		Level:            zap.NewAtomicLevelAt(zap.InfoLevel),
		Development:      false,
		Encoding:         "json",
		EncoderConfig:    encoderConfig,
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}

	zapLogger, err := config.Build(zap.AddCaller(), zap.AddCallerSkip(1))
	if err != nil {
		panic(fmt.Sprintf("failed to build logger: %v", err))
	}

	return &StandardLogger{zapLogger}
}

func customTimeEncoder(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
	enc.AppendString(t.Format(time.RFC3339))
}

func (l *StandardLogger) WithFields(fields Fields) Logger {
	return &StandardLogger{
		logger: l.logger.With(zapFields(fields)...),
	}
}

func (l *StandardLogger) Info(msg string, args Fields) {
	l.logger.Info(msg, zapFields(args)...)
}

func (l *StandardLogger) Infof(msg string, args ...any) {
	l.logger.Sugar().Infof(msg, args...)
}

func (l *StandardLogger) Debug(msg string, args Fields) {
	l.logger.Debug(msg, zapFields(args)...)
}

func (l *StandardLogger) Debugf(msg string, args ...any) {
	l.logger.Sugar().Debugf(msg, args...)
}

func (l *StandardLogger) Warn(msg string, args Fields) {
	l.logger.Warn(msg, zapFields(args)...)
}

func (l *StandardLogger) Warnf(msg string, args ...any) {
	l.logger.Sugar().Warnf(msg, args...)
}

func (l *StandardLogger) Error(msg string, err error, args Fields) {
	l.logger.With(zap.NamedError("error", err)).Error(msg, zapFields(args)...)
}

func (l *StandardLogger) Errorf(msg string, err error, args ...any) {
	l.logger.Sugar().With(zap.NamedError("error", err)).Errorf(msg, args...)
}

func (l *StandardLogger) Fatal(msg string, args Fields) {
	l.logger.Fatal(msg, zapFields(args)...)
}

func (l *StandardLogger) Fatalf(msg string, args ...any) {
	l.logger.Sugar().Fatalf(msg, args...)
}

func (l *StandardLogger) Flush() error {
	return l.logger.Sync()
}

func zapFields(fields Fields) []zap.Field {
	if fields == nil {
		return []zap.Field{}
	}
	zapFields := make([]zap.Field, 0, len(fields))

	for key, val := range fields {
		zapFields = append(zapFields, zap.Any(key, val))
	}

	return zapFields
}
