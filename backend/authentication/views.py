from rest_framework.response import Response
from rest_framework.views import APIView

from .serializer import SignUpSerializer, UserSerializer


class SignUpAPIView(APIView):
    def post(self, request, *args, **kwards):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.data)
